/*
    Copyright 2021, Zuri plugin reminder.
    All rights reserved.
    Written By: King Etiosasere, 30th August 2021 
*/

import env from '@config/environment'
// eslint-disable-next-line import/no-unresolved
import request from 'supertest'
import makeDb from '../src/db/index'
import { expect } from 'chai'
import faker from 'faker'

const { getDevBaseUrl } = env
const api = request(`${getDevBaseUrl().apiUrl}`)
const db = makeDb()

describe('Reminder controllers', () => {
	const collectionName = 'reminders'

	it('successfully create new reminder', async () => {
		const res = await api.post('/reminders').send({
			title: faker.random.word(),
			description: faker.random.words(),
			assignee: faker.name.firstName(),
			creator: faker.name.findName(),
			startDate: faker.date.recent(),
			dueDate: faker.date.soon(),
			time: '12:45',
		})
		expect(res.body.data.title).to.be.a('string')
		expect(res.body.success).to.be.true
	})

	it('successfully get all reminders', async () => {
		const res = await api.get('/reminders')
		expect(res.body.data).to.be.an('array')
	})

	it('successfully search for reminder', async () => {
		const res = await api.get('/search').set('Content-type', 'application/json').send({
			text: 'online',
		})
		expect(res.body.data).to.be.an('array')
	})

	it('reminder successfully deleted', async () => {
		const creatDoc = await db.create(collectionName, {
			priority: 2,
			plugin_id: 'zc_reminder',
			organization_id: 'darwin_organization',
			collection_name: collectionName,
		})
		const res = await api.delete('/reminders')
		// request(app).delete(`/api/v1/reminders/${creatDoc.id}`).expect(201)
	})
})
