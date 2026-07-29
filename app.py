from flask import Flask, render_template, request, redirect, session, jsonify
from config import db, get_cursor
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
app.secret_key = "feminova_secret_key"


# ---------------- HOME (LOGIN PAGE) ----------------
@app.route('/')
def home():
    return render_template("index.html")


# ---------------- SIGNUP PAGE ----------------
@app.route('/signup_page')
def signup_page():
    return render_template("signup.html")


# ---------------- SIGNUP LOGIC ----------------
@app.route('/signup', methods=['POST'])
def signup():
    name = request.form['name']
    email = request.form['email']
    password = generate_password_hash(request.form['password'])

    cur = get_cursor()

    sql = "INSERT INTO users(name,email,password) VALUES(%s,%s,%s)"
    cur.execute(sql, (name, email, password))
    db.commit()
    cur.close()

    return redirect('/')


# ---------------- LOGIN LOGIC ----------------
@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']

    cur = get_cursor()

    sql = "SELECT * FROM users WHERE name=%s"
    cur.execute(sql, (username,))
    user = cur.fetchone()
    cur.close()

    if user and check_password_hash(user['password'], password):
        session['user'] = user['name']
        return redirect('/dashboard')
    else:
        return "Invalid Login"


# ---------------- DASHBOARD ----------------
@app.route('/dashboard')
def dashboard():
    if 'user' in session:
        return render_template("dashboard.html")
    return redirect('/')


# ---------------- PERIOD PAGE ----------------
@app.route('/period')
def period():
    if 'user' in session:
        return render_template("period.html")
    return redirect('/')


# ---------------- SAVE PERIOD DATA ----------------
@app.route('/save_period', methods=['POST'])
def save_period():
    if 'user' not in session:
        return jsonify({"error": "Not logged in"}), 401

    data = request.get_json()

    last_period = data.get('last_period')
    cycle_length = data.get('cycle_length')
    period_length = data.get('period_length')

    cur = get_cursor()

    cur.execute("SELECT id FROM users WHERE name=%s", (session['user'],))
    user = cur.fetchone()

    if not user:
        return jsonify({"error": "User not found"}), 404

    sql = """
    INSERT INTO period_data (user_id, last_period, cycle_length, period_length)
    VALUES (%s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
        last_period=%s,
        cycle_length=%s,
        period_length=%s
    """

    cur.execute(sql, (
        user['id'],
        last_period, cycle_length, period_length,
        last_period, cycle_length, period_length
    ))

    db.commit()
    cur.close()

    return jsonify({"message": "Saved successfully"})

# ---------------- GET PERIOD DATA ----------------
@app.route('/get_period')
def get_period():
    if 'user' not in session:
        return jsonify({"error": "Not logged in"}), 401

    cur = get_cursor()

    cur.execute("SELECT id FROM users WHERE name=%s", (session['user'],))
    user = cur.fetchone()

    if not user:
        return jsonify({})

    cur.execute("SELECT * FROM period_data WHERE user_id=%s", (user['id'],))
    data = cur.fetchone()

    cur.close()

    if data:
        return jsonify({
            "last_period": str(data['last_period']),
            "cycle_length": data['cycle_length'],
            "period_length": data['period_length']
        })

    return jsonify({})

# ---------------- MYTH PAGE ----------------
@app.route('/myth')
def myth():
    if 'user' in session:
        return render_template("myth.html")
    return redirect('/')


# ---------------- NEWS PAGE ----------------
@app.route('/news')
def news():
    if 'user' in session:
        return render_template("news.html")
    return redirect('/')


# ---------------- EXERCISE PAGE ----------------
@app.route('/exercise')
def exercise():
    if 'user' in session:
        return render_template("exercise.html")
    return redirect('/')


# ---------------- LOGOUT ----------------
@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect('/')


if __name__ == "__main__":
    app.run(debug=True)