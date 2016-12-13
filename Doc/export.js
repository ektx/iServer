c = db.myproject.aggregate([{$unwind:'$project'}]);
while(c.hasNext()) {
    printjson(c.next());
}