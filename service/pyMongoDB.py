import pymongo
import random
import json
import datetime,time
# import copy
import sys, os

def getTimestampFromDatetime(d=None):
	if d is None:
		d = datetime.datetime.now()
	return time.mktime(d.timetuple())

if __name__ == '__main__':	
	start = getTimestampFromDatetime()
	client = pymongo.MongoClient()
	db = client.laozhangDB
	saveData = []
	for i in range(0, 1000000):
		saveData.append({
			'createTime': time.asctime(time.localtime(time.time())),
			'username': "".join(random.sample('123456789qwertyuiopasdfghjklzxcvbnm',random.randint(9,16))),
			'randNum0': random.randint(100000, 999999),
			'randNum1': random.randint(100000, 999999),
			'randNum2': random.randint(100000, 999999),
			'randNum3': random.randint(100000, 999999),
			'randNum4': random.randint(100000, 999999),
			'randNum5': random.randint(100000, 999999),
			'randNum6': random.randint(100000, 999999),
			'randNum7': random.randint(100000, 999999),
			'randNum8': random.randint(100000, 999999),
			'randNum9': random.randint(100000, 999999),
			'indexId': i
		})
	# 66s
	db.pyTestData.drop()
	db.pyTestData.insert(saveData)

	# bulk = db.pyTestData.initialize_ordered_bulk_op()
	# for i in range(0, 1000000):
	# 	bulk.insert({
	# 		'indexId': i,
	# 		'createTime': time.asctime(time.localtime(time.time())),
	# 		'username': "".join(random.sample('123456789qwertyuiopasdfghjklzxcvbnm',random.randint(9,16))),
	# 		'randNum0': random.randint(100000, 999999),
	# 		'randNum1': random.randint(100000, 999999),
	# 		'randNum2': random.randint(100000, 999999),
	# 		'randNum3': random.randint(100000, 999999),
	# 		'randNum4': random.randint(100000, 999999),
	# 		'randNum5': random.randint(100000, 999999),
	# 		'randNum6': random.randint(100000, 999999),
	# 		'randNum7': random.randint(100000, 999999),
	# 		'randNum8': random.randint(100000, 999999),
	# 		'randNum9': random.randint(100000, 999999)
	# 	})
	# #78s
	# bulk.execute()
	end = getTimestampFromDatetime()
	print('time: {0}s'.format(end-start))