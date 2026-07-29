from langchain_community.document_loaders import PyPDFLoader, DirectoryLoader
from langchain.prompts import PromptTemplate
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_community.llms import CTransformers
from langchain.chains import RetrievalQA
import chainlit as cl

DB_FAISS_PATH = 'vectorstore/db_faiss'

# Custom prompt template for QA
custom_prompt_template = """Use the following pieces of information to answer the user's question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.

Context: {context}
Question: {question}

Only return the helpful answer below and nothing else.
Helpful answer:
"""

def set_custom_prompt():
    """
    Prompt template for QA retrieval for each vectorstore
    """
    return PromptTemplate(template=custom_prompt_template,
                          input_variables=['context', 'question'])

# Retrieval QA Chain
def retrieval_qa_chain(llm, prompt, db):
    return RetrievalQA.from_chain_type(
        llm=llm,
        chain_type='stuff',
        retriever=db.as_retriever(search_kwargs={'k': 2}),
        return_source_documents=True,
        chain_type_kwargs={'prompt': prompt}
    )

# Load the LLM model
def load_llm():
    return CTransformers(
        model="TheBloke/Llama-2-7B-Chat-GGML",
        model_type="llama",
        max_new_tokens=512,
        temperature=0.5
    )

# QA Model Function
def qa_bot():
    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2",
        model_kwargs={'device': 'cpu'}
    )
    
    # Enable safe FAISS loading
    db = FAISS.load_local(DB_FAISS_PATH, embeddings, allow_dangerous_deserialization=True)

    llm = load_llm()
    qa_prompt = set_custom_prompt()
    return retrieval_qa_chain(llm, qa_prompt, db)

# Output function
def final_result(query):
    qa_result = qa_bot()
    return qa_result({'query': query})

# Chainlit chatbot
@cl.on_chat_start
async def start():
    try:
        chain = qa_bot()
        msg = cl.Message(content="Starting the FeminaBot...")
        await msg.send()
        msg.content = "Hi, Welcome to FeminaBot. What is your query?"
        await msg.update()
        cl.user_session.set("chain", chain)
    except Exception as e:
        await cl.Message(content=f"Error starting bot: {e}").send()

@cl.on_message
async def main(message: cl.Message):
    chain = cl.user_session.get("chain") 
    if not chain:
        await cl.Message(content="Error: QA bot not initialized.").send()
        return

    cb = cl.AsyncLangchainCallbackHandler(
        stream_final_answer=True, answer_prefix_tokens=["FINAL", "ANSWER"]
    )
    cb.answer_reached = True

    try:
        res = await chain.acall(message.content, callbacks=[cb])
        
    except Exception as e:
        await cl.Message(content=f"Error processing message: {e}").send()
