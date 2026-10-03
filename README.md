# 🚀 Explainable AI Dashboard

A transparent **RAG (Retrieval-Augmented Generation)** system that shows **exactly where AI answers come from**. Built to solve the #1 problem in Enterprise AI: **Trust**.

![Tech Stack](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)
![Tech Stack](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![Tech Stack](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript)
![Tech Stack](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwindcss)

---

## ✨ Features

- **Multi-Persona Support** — Supply Chain Manager 📦, School Administrator 🎓, HR Manager 👥
- **Source Attribution** — Every AI answer highlights the exact document paragraph used
- **Confidence Scoring** — Green badges for verified answers, warnings for low confidence
- **Dark Mode UI** — Professional, enterprise-ready design
- **Real-time Chat** — Powered by FastAPI backend with intelligent search

---

## 🎯 Why This Matters

When you ask a question, the AI doesn't just answer — it shows you:

1. ✅ The **exact source document**
2. 📄 The **specific page number**
3. 📊 A **confidence score**
4. 🔍 **Relevance percentage**

> This turns a "black box" AI into an **audit-proof, compliance-ready** solution.

---

## 🛠️ Tech Stack

| Layer      | Technology                                      |
| ---------- | ----------------------------------------------- |
| **Frontend** | Next.js 15, React 18, TypeScript, Tailwind CSS |
| **Backend**  | FastAPI (Python), Pydantic, Uvicorn            |
| **Search**   | Keyword-based RAG (upgradeable to Vector DB)   |
| **Icons**    | Lucide React                                   |

---

## 📦 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.9
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/Ratzzz55/explainable-ai-dashboard.git
cd explainable-ai-dashboard
```

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt

# (Optional) Create a .env file from the example
cp .env.example .env
# Add your API key if integrating a real LLM

# Start the server
python main.py
```

> Backend runs at: `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

> Frontend runs at: `http://localhost:3000`

---

## 📊 How It Works

```
User Question  →  Frontend (Next.js)  →  Backend API (FastAPI)
                                              │
                                    Search Knowledge Base
                                              │
                                    Return Answer + Sources
                                              │
                  Frontend highlights source  ←┘
```

1. **User asks a question** → Frontend sends it to the backend
2. **Backend searches the knowledge base** → Uses keyword matching (V1)
3. **Returns answer + sources** → Includes source metadata (document, page, relevance)
4. **Frontend highlights the source** → Auto-scrolls to the relevant document paragraph

---

## 📁 Project Structure

```
explainable-ai-dashboard/
├── backend/
│   ├── main.py                 # FastAPI server & RAG search logic
│   ├── knowledge_base.json     # Structured knowledge data (3 personas)
│   ├── requirements.txt        # Python dependencies
│   └── .env.example            # Environment variable template
├── frontend/
│   ├── app/
│   │   ├── page.tsx            # Main dashboard page
│   │   ├── layout.tsx          # Root layout
│   │   └── globals.css         # Global styles
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── next.config.js
│   └── postcss.config.js
├── .gitignore
└── README.md
```

---

## 🎨 Design Highlights

- **Dark Mode** — Enterprise-grade aesthetic
- **Gradient Accents** — Modern, premium feel
- **Smooth Animations** — Micro-interactions on hover
- **Responsive Layout** — Works on all screen sizes
- **Custom Scrollbars** — Attention to detail

---

## � Future Enhancements

- [ ] Replace keyword search with **Vector Database** (Pinecone / ChromaDB)
- [ ] Add **real LLM integration** (Gemini / GPT) for smarter answers
- [ ] Implement **PDF upload & parsing** instead of static JSON
- [ ] Add **user feedback loop** to improve answer accuracy
- [ ] Deploy to production (**Vercel** + **Render**)

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

---

## 📬 Contact

**Pratyaksh** — [GitHub](https://github.com/Ratzzz55)

---

> Built with ❤️ to make AI transparent and trustworthy.
