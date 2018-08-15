
# A very simple Flask Hello World app for you to get started with...

from flask import Flask,render_template, request
import json

app = Flask(__name__)



@app.route('/')
def TeacherSignUp():
    return render_template('TeacherSignUp.html')


@app.route('/signUpUser', methods=['POST'])
def signUpUser():

	FrontEndData =  request.form['walao']
	#Making the above into an array

	return json.dumps('lol')

if __name__ == '__main__':

	IP_Address = '127.0.0.1'
	Port_Number = 7000

	app.run(host=IP_Address,port=Port_Number, debug=True)