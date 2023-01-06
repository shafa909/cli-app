### to run :
 - change directory, cd cli-app
 - <b>npm install</b>
 - <b>node index.js or ./index.js</b>


### Requirment :
- [install mongodb]([https://min-api.cryptocompare.com/](https://www.mongodb.com/docs/manual/installation/))  
- migrate [CSV file](https://s3-ap-southeast-1.amazonaws.com/static.propine.com/transactions.csv.zip) to mongodb.


### Migration Guide 
- convert csv to json

```
jq --null-input --raw-input 'input | split(",") as $fields | inputs | split(",") as $values |{($fields[0]): {"$date": {"$numberLong": ($values[0]+"000")}}, ($fields[1]): $values[1], ($fields[2]): ($values[2] | tonumber)}' yourFile.csv > yourFile.json
```
- then migrate using mongoimport

```
mongoimport --db=crypto --collection=t --file=yourFile.json
```
### Usage
- date format should be DD-MM-YYYY, eg: date=15-12-2017
- token can BTC, btc, ETH,  eg: token=BTC  

### Command

- command format can, date and token, it results the portfolio value of that token in USD on that date
```
>> date=11-12-2018,token=ETH
```
- command format can, only date, it results latest portfolio value per token in USD on that date:
```
>> date=11-12-2018
```
- command format can, only token, it results latest portfolio value the token in USD :
```
>> token=ETH
```
- command format can be empty, it results latest portfolio value per token in USD: 
```
>> 
```
### Screenshot 

- with date and token :

<img width="571" alt="Screenshot 2023-01-05 at 11 13 23 PM" src="https://user-images.githubusercontent.com/23289583/210854158-1aa62551-3e21-4858-874b-05fc6d95c6aa.png">

- with only date:

<img width="571" alt="Screenshot 2023-01-05 at 11 55 52 PM" src="https://user-images.githubusercontent.com/23289583/210854289-36597aed-d9fa-4dc3-9d18-8e6bd081e2c3.png">

- with only token :

<img width="571" alt="Screenshot 2023-01-05 at 11 16 48 PM" src="https://user-images.githubusercontent.com/23289583/210854421-25343cf5-ae8d-4086-9d2d-2a9474894e22.png">

- with empty string :

<img width="571" alt="Screenshot 2023-01-05 at 11 55 09 PM" src="https://user-images.githubusercontent.com/23289583/210854522-728ef7d0-9edf-4ed7-8cb7-cf56bbd7a9bd.png">

