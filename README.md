### to run :
#### cd cli-app
#### npm install
#### node index.js or ./index.js


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
- command format can, date and token, it results the portfolio value of that token in USD on that date
```
>> date=11-12-2018,token=ETH
```
- command format can, only date, it results latest portfolio value per token in USD on that date:
```
>> date=11-12-2018
```
- command format can, only token, it results portfolio value per token in USD on that date
```
>> token=ETH
```
- command format can be empty, it results latest portfolio value per token in USD: 
```
>> 
```

