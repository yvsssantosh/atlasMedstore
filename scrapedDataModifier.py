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
r.db('test').table('manufacturer').delete().run()

data = r.db('test').table('sampleData').run()

for p in data:
    r.db('test').table('chemComp').insert([
        {
            "composition": p['medicine']['activeIngredient'],
            "id" : r.uuid().run()
        }
    ]).run()
    r.db('test').table('manufacturer').insert([
        {
            "name": p['medicine']['manufacturerName'],
            "id" : r.uuid().run()
        }
    ]).run()

    con1 = r.db('test').table('chemComp').filter(r.row['composition'] == p['medicine']['activeIngredient']).run()
    con2 = r.db('test').table('manufacturer').filter(r.row['name'] == p['medicine']['manufacturerName']).run()
    for c in con1:
        for m in con2:
            r.db('test').table('sampleProd').insert([
                {"medicine":{
                    "activeIngredient": p['medicine']['activeIngredient'] ,
                    "costPerUnit":  p['medicine']['costPerUnit'] ,
                    "currency":  p['medicine']['currency'] ,
                    "manufacturer_id":  m['id'] ,
                    "name": p['medicine']['name'],
                    "chemicalComposition_id" : c['id']
                }}
            ]).run()
            break
        break