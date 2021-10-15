const server = require('./server')
const Auths = require('../api/auth/auth-router')
const Jokes = require('../api/jokes/jokes-router')
const request = require('supertest')
const db = require('../data/dbConfig')

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

afterAll(async () => {
  await db.destroy()
})

describe('/register tests', () => {
  let res
  beforeEach(async () => {
    res = await request(server).post('/api/auth/register')
    .send({username:'test', password:'33333'})
  })

  it('responds with 200 OK', async () => {
    expect(res.status).toBe(200)
  })

  it('responds with the right user', async () => {
    const expectedName = 'test'
    const actualName = res.body.username

    expect(expectedName).toEqual(actualName)
  })
})

describe('/login tests', () => {
  let res
  beforeEach(async () => {
    res = await request(server).post('/api/auth/login')
    .send({username:'bob', password:'33333'})
  })

  it('responds with 200 OK', async () => {
    expect(res.status).toBe(200)
  })

  it('responds with the right user', async () => {
    const expectedName = 'test'
    const actualName = res.body.username

    expect(expectedName).toEqual(actualName)
  })
})

describe('/jokes tests', () => {
  let res
  beforeEach(async () => {
    await request(Auths).post('/login', {username:'bob', password:'33333'})
    res = await request(Jokes).get('/')
  })
  it('responds with 200 OK', async () => {
    expect(res.status).toBe(200)
  })
  it('responds with 3 jokes', async () => {
    expect(res.body).toHaveLength(4)
  })
})


