# Conscia: AI-Powered Ethical Shopping Companion  

Conscia is a **full-stack web application** designed to empower consumers to make ethically informed purchasing decisions.  
In a world of complex supply chains and opaque marketing, Conscia cuts through the noise by using AI to analyze products across four key ethical pillars:  

- 🌍 **Environmental Impact**  
- 👷 **Labor Rights**  
- 🐾 **Animal Welfare**  
- 🏛 **Corporate Governance**  

---

## ✨ Core Features  

- **Dynamic Product Browser** – Explore products across categories: Beauty, Books, Fashion, and Groceries.  
- **Ethical Scoring System** – Deterministic scores across the four ethical pillars for at-a-glance insights.  
- **AI-Generated Ethical Snapshots** – Concise summaries highlighting product strengths and weaknesses.  
- **Interactive AI Chatbot** –  
  - Answers questions about product scores and reviews.  
  - Provides top recommendations (e.g., “best 5” in a category).  
  - Explains general ethical shopping principles.  
- **Professional Dark-Themed UI** – A sleek, modern, and fully responsive interface.  

---

## 📂 File Structure  

```
/ethi-scan
│
├── /backend
│   ├── /.venv/                 # Virtual environment for Python dependencies
│   ├── /data/                  # Place external datasets here
│   │   ├── /beauty/
│   │   ├── /books/
│   │   ├── /fashion/
│   │   ├── /groceries/
│   ├── server.py               # Flask server + API/AI logic
│
├── /frontend
│   ├── /public/index.html, favicon.ico
│   ├── /src/
│   │   ├── /components/EthicalScore.js, ProductModal.js
│   │   ├── /screens/LandingPage.js, ProductBrowser.js
│   │   ├── App.js, index.js, styles.js
│   ├── package.json
```

---

## 📊 External Datasets  

Since the datasets are large, they are **not included** in the repository. Please download them manually from Kaggle:  

- [Sephora Products & Skincare Reviews](https://www.kaggle.com/datasets/nadyinky/sephora-products-and-skincare-reviews) – ~8,000 Sephora products with reviews.  
- [Amazon Sales Dataset](https://www.kaggle.com/datasets/karkavelrajaj/amazon-sales-dataset) – Ratings & reviews for 1,000+ Amazon products.  
- [Amazon Top 50 Bestselling Books (2009–2019)](https://www.kaggle.com/datasets/sootersaalu/amazon-top-50-bestselling-books-2009-2019) – 550 bestselling books from Goodreads.  
- [Myntra Products Dataset](https://www.kaggle.com/datasets/ronakbokaria/myntra-products-dataset) – 1,060,213 Myntra product listings.  

### 📥 How to Use the Datasets  

1. Download each dataset from the links above.  
2. Place them inside the `/backend/data/` directory as:  

```
/backend/data/
    ├── beauty/sephora_products.csv
    ├── fashion/myntra_products.csv
    ├── books/amazon_bestselling_books.csv
    ├── groceries/amazon_sales.csv
```

---

## ⚙️ Setup and Installation  

### Backend Setup  

```bash
cd backend

# Create and activate virtual environment
# Windows
python -m venv .venv
.venv\Scripts\activate

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install Flask Flask-Cors pandas numpy requests
```

1. Get a **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).  
2. Add your API key to `server.py` in the `GEMINI_API_KEY` variable.  
3. Run the server:  

```bash
python server.py
```

Backend runs at: **http://127.0.0.1:5000**  

---

### Frontend Setup  

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm start
```

Frontend runs at: **http://localhost:3000**  

---

## 🛠️ Technologies Used  

### Backend  
- **Python** – Core language  
- **Flask** – API framework  
- **Pandas & NumPy** – Data handling  
- **Google Gemini API** – AI chatbot & summaries  

### Frontend  
- **React.js** – UI framework  
- **CSS-in-JS** – Custom styling  
- **No external CSS frameworks** – Fully custom professional look  

---

## 🚀 Future Improvements  
- Add more product categories  
- Support user accounts & favorites  
- Expand ethical scoring to include transparency & sustainability certifications  

---

## 📜 License  
This project is licensed under the **MIT License** – see the [LICENSE](LICENSE) file for details.  
