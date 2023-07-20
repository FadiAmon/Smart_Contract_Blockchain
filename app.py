from flask import Flask, render_template, request
import json
import urllib

app = Flask(__name__, static_folder='static', static_url_path='/static')


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/ApartmentDetails')
def apartment_details():

    encoded_data = request.args.get('data')
    details_data = json.loads(urllib.parse.unquote(encoded_data))

    # Pass the data to the template and render the HTML
    return render_template('apartment_details.html', details_data=details_data)


@app.route('/TransferHistory')
def transfer_history():
    encoded_data = request.args.get('data')
    transfer_data = json.loads(urllib.parse.unquote(encoded_data))
    transfer_list = transfer_data['transferList']

    return render_template('transfer_history.html', transferList=transfer_list)

@app.after_request
def add_cache_control(response):
    response.headers['Cache-Control'] = 'no-store'
    return response


if __name__ == '__main__':
    app.run()
