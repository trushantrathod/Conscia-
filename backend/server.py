from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import glob
import os
import requests
import re

app = Flask(__name__)
CORS(app)

# --- Global Data Storage ---
DATASETS = {}
DATA_DIR = 'data'
GEMINI_API_KEY = "AIzaSyBCgtEteGGMf8ZfQixmd1ce9llnScObaQY" # Make sure your API key is here

# --- Data Loading ---
def load_category_data(category_name):
    category_path = os.path.join(DATA_DIR, category_name)
    try:
        products_path = glob.glob(os.path.join(category_path, '*.csv'))[0]
    except IndexError:
        print(f"⚠️ No CSV file found for category '{category_name}'")
        return None

    try:
        df_products = pd.read_csv(products_path, on_bad_lines='skip')
        id_col = next((c for c in ['asin', 'product_id', 'id'] if c in df_products.columns), 'product_id')
        name_col = next((c for c in ['product_name', 'Product Name', 'name', 'Name', 'title'] if c in df_products.columns), 'product_name')
        brand_col = next((c for c in ['brand_name', 'Brand', 'brand', 'Author'] if c in df_products.columns), 'brand_name')
        
        if id_col not in df_products.columns: df_products['product_id'] = range(len(df_products))
        df_products.dropna(subset=[name_col, id_col], inplace=True)
        df_products['product_id'] = df_products[id_col].astype(str)
        df_products.rename(columns={name_col: 'product_name', brand_col: 'brand_name', id_col: 'product_id'}, inplace=True)
        
        # --- FIX: Check for reviews in the main product file OR separate files ---
        df_reviews = None
        review_files = glob.glob(os.path.join(category_path, 'reviews_*.csv'))
        
        # Case 1: Reviews are in separate files
        if review_files:
            df_reviews = pd.concat([pd.read_csv(f, low_memory=False) for f in review_files], ignore_index=True)
        # Case 2: Reviews are in the main product file
        elif all(col in df_products.columns for col in ['product_id', 'rating', 'review_text']):
            df_reviews = df_products[['product_id', 'rating', 'review_text', 'user_name']].copy()

        if df_reviews is not None:
            if 'product_id' in df_reviews.columns and 'rating' in df_reviews.columns:
                df_reviews['rating_numeric'] = pd.to_numeric(df_reviews['rating'], errors='coerce')
                df_reviews.dropna(subset=['review_text', 'product_id', 'rating_numeric'], inplace=True)
                df_reviews['product_id'] = df_reviews['product_id'].astype(str)
            else: 
                df_reviews = None
        
        df_final_products = df_products
        if df_reviews is not None:
            df_final_products = df_products[df_products['product_id'].isin(df_reviews['product_id'].unique())]
        
        print(f"✅ Loaded category '{category_name}': {len(df_final_products)} products.")
        return {'products': df_final_products, 'reviews': df_reviews}
    except Exception as e:
        print(f"❌ Error loading data for '{category_name}': {e}")
        return None

for category in os.listdir(DATA_DIR):
    if os.path.isdir(os.path.join(DATA_DIR, category)):
        if category.lower() == 'electronics': continue
        DATASETS[category] = load_category_data(category)

def generate_deterministic_score(product_name, pillar_name):
    if not isinstance(product_name, str): return 50
    name_seed = sum(ord(c) for c in product_name)
    pillar_multiplier = {'environment': 1.1, 'labor': 1.2, 'animal_welfare': 1.3, 'governance': 1.4}.get(pillar_name, 1)
    final_seed = name_seed * pillar_multiplier
    return 20 + (int(final_seed) % 76)

# --- API Endpoints ---
@app.route("/api/categories")
def get_categories():
    return jsonify([cat for cat, data in DATASETS.items() if data is not None])

@app.route("/api/<category>/reviews/<product_id>")
def get_reviews_for_product(category, product_id):
    if category in DATASETS and DATASETS[category] and DATASETS[category]['reviews'] is not None:
        df_reviews = DATASETS[category]['reviews']
        product_reviews_df = df_reviews[df_reviews['product_id'] == str(product_id)].copy()
        rename_map = {'user_name': 'author_name', 'review_text': 'review_text', 'review_title': 'review_title', 'rating': 'rating'}
        final_rename_map = {k: v for k, v in rename_map.items() if k in product_reviews_df.columns}
        if final_rename_map:
            product_reviews_df.rename(columns=final_rename_map, inplace=True)
        return product_reviews_df.to_json(orient="records")
    return jsonify([]), 200 # Return empty list instead of error

@app.route("/api/<category>/search")
def search_products(category):
    if category not in DATASETS or not DATASETS[category]:
        return jsonify({"error": "Category not found"}), 404
    df_products = DATASETS[category]['products']
    query = request.args.get('q', '')
    sort_by = request.args.get('sort_by', 'default')
    
    results_df = df_products[df_products['product_name'].str.contains(query, case=False, na=False)] if query else df_products.head(100)
    
    results_df = results_df.replace({np.nan: None})
    results_list = results_df.to_dict(orient="records")
    
    for product in results_list:
        product_name = product.get('product_name')
        product['ethical_score'] = {
            'environment': generate_deterministic_score(product_name, 'environment'),
            'labor': generate_deterministic_score(product_name, 'labor'),
            'animal_welfare': generate_deterministic_score(product_name, 'animal_welfare'),
            'governance': generate_deterministic_score(product_name, 'governance')
        }
    if sort_by != 'default':
        results_list.sort(key=lambda p: p.get('ethical_score', {}).get(sort_by, 0), reverse=True)
    return jsonify(results_list)

@app.route("/api/generate-summary", methods=['POST'])
def generate_summary():
    product_data = request.json
    if not product_data:
        return jsonify({"error": "No product data provided"}), 400

    product_name = product_data.get('product_name')
    scores = product_data.get('ethical_score', {})

    prompt_text = f"""
    You are an ethical shopping assistant. Based on the data, write a 2-3 sentence ethical summary.
    Product: {product_name}
    Scores: Environment: {scores.get('environment')}, Labor: {scores.get('labor')}, Animal Welfare: {scores.get('animal_welfare')}, Governance: {scores.get('governance')}
    """

    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    payload = {"contents": [{"parts": [{"text": prompt_text}]}]}

    try:
        response = requests.post(api_url, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        summary = result['candidates'][0]['content']['parts'][0]['text']
        return jsonify({"summary": summary.strip()})
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return jsonify({"error": "Failed to communicate with AI service"}), 500

@app.route("/api/chatbot", methods=['POST'])
def chatbot():
    data = request.json
    product = data.get('product')
    chat_history = data.get('history', [])
    category = data.get('category')
    user_query = chat_history[-1]['text'].lower() if chat_history and chat_history[-1]['sender'] == 'user' else ''

    if not chat_history:
        return jsonify({"error": "Chat history is required"}), 400

    recommendation_intent = 'best' in user_query or 'top' in user_query or 'recommend' in user_query
    number_match = re.search(r'\d+', user_query)
    number_to_recommend = int(number_match.group()) if number_match else 5
    if number_to_recommend > 10: number_to_recommend = 10

    recommendation_category = category
    if not recommendation_category:
        for cat in DATASETS.keys():
            if cat.lower() in user_query:
                recommendation_category = cat
                break

    pillar_to_sort_by = None
    pillars = ['environment', 'labor', 'animal welfare', 'governance']
    for p in pillars:
        if p in user_query:
            pillar_to_sort_by = p.replace(' ', '_')
            break

    if recommendation_intent and recommendation_category and recommendation_category in DATASETS:
        df_all_products = DATASETS[recommendation_category]['products'].copy()
        
        if pillar_to_sort_by:
            ranking_metric = pillar_to_sort_by
            df_all_products['score'] = df_all_products['product_name'].apply(lambda name: generate_deterministic_score(name, ranking_metric))
            sort_description = f"their '{pillar_to_sort_by.replace('_', ' ')}' score"
        else:
            df_all_products['score'] = df_all_products['product_name'].apply(lambda name: np.mean([generate_deterministic_score(name, p) for p in pillars]))
            sort_description = "their overall ethical score"

        top_products = df_all_products.sort_values(by='score', ascending=False).head(number_to_recommend)
        
        products_text = "\n".join([f"- {row['product_name']} (Score: {row['score']:.0f})" for _, row in top_products.iterrows()])
        
        system_prompt = f"""
        You are a shopping assistant. The user wants to know the top {number_to_recommend} products in '{recommendation_category}', ranked by {sort_description}.
        Here are the top products you found:
        {products_text}
        Your task: Present this as a friendly, numbered list. Start by stating how the list is ranked. Do not use markdown.
        """
    else:
        if product:
            review_text = "No user reviews available."
            if category and category in DATASETS and DATASETS[category]['reviews'] is not None:
                df_reviews = DATASETS[category]['reviews']
                product_reviews = df_reviews[df_reviews['product_id'] == str(product.get('product_id'))]
                if not product_reviews.empty:
                    review_snippets = [f"- '{row['review_text']}'" for _, row in product_reviews.head(3).iterrows()]
                    review_text = "User Reviews:\n" + "\n".join(review_snippets)

            system_prompt = f"""
            You are a data retrieval bot. Your ONLY function is to analyze the provided data and answer questions based EXCLUSIVELY on it.
            ### Data
            - Name: {product.get('product_name')}
            - Brand: {product.get('brand_name')}
            - Scores: {product.get('ethical_score')}
            - {review_text}
            ### Rules
            - Answer the user's question using ONLY the provided data.
            - Do NOT use conversational filler or ask clarifying questions.
            - Use plain text only. Do not use markdown.
            - If the data doesn't answer the question, your ONLY response is: "I don't have that specific information."
            """
        elif recommendation_intent:
            system_prompt = "You are a helpful assistant. The user asked for a recommendation but didn't specify a category. Ask them which category they are interested in."
        else:
            system_prompt = "You are Conscia, a helpful ethical shopping assistant. Answer general questions about ethical shopping in 1-2 sentences. Do not use markdown."

    gemini_history = [{"role": "user" if msg['sender'] == 'user' else "model", "parts": [{"text": msg['text']}]} for msg in chat_history]
    
    api_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}
    payload = {"contents": gemini_history, "systemInstruction": {"parts": [{"text": system_prompt}]}}

    try:
        response = requests.post(api_url, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        ai_response = result['candidates'][0]['content']['parts'][0]['text']
        return jsonify({"reply": ai_response.strip()})
    except Exception as e:
        print(f"Error calling Gemini API for chat: {e}")
        return jsonify({"error": "Failed to get a response from the chatbot"}), 500

if __name__ == "__main__":
    app.run(debug=True)
