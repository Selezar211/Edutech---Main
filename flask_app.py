
# A very simple Flask Hello World app for you to get started with...

from flask import Flask,render_template

app = Flask(__name__)


@app.route('/')
def home():
    return render_template('home.html')

@app.route('/Login')
def Login():
    return render_template('Login.html')

@app.route('/Profile')
def Profile():
    return render_template('Profile.html')