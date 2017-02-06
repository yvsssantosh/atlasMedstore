import rethinkdb as r,json
import pprint as p
r.connect('localhost').repl()
cursor = r.table('scrapedData').run()

# for doc in cursor:
#     print doc['medicine']['activeIngredient']
r.db('test').table_drop('chemComp').run()
r.db('test').table_create('chemComp', primary_key='composition').run()
r.db('test').table('sampleProd').delete().run()
r.db('test').table('chemComp').delete().run()



data = r.db('test').table('scrapedData').run()

for p in data:
    uuid = r.uuid().run()
    r.db('test').table('chemComp').insert([
        {
            "composition": p['medicine']['activeIngredient'],
            "id" : uuid
        }
    ]).run()

    con = r.db('test').table('chemComp').filter(r.row['composition'] == p['medicine']['activeIngredient']).run()
    for c in con:
        r.db('test').table('sampleProd').insert([
            {"medicine":{
                "activeIngredient": p['medicine']['activeIngredient'] ,
                "costPerUnit":  p['medicine']['costPerUnit'] ,
                "currency":  p['medicine']['currency'] ,
                "manufacturerName":  p['medicine']['manufacturerName'] ,
                "name": p['medicine']['name'],
                "chemicalComposition_id" : c['id']
            }}
        ]).run()
        break