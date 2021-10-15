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

describe('status tests for /register and /login', () => {
  let res
  beforeEach(async () => {
    res = await request(server).post('/api/auth/register')
    .send({username:'first test', password:'33333'})
  })

  it('responds with 200 OK for /register', async () => {
    expect(res.status).toBe(200)
  })

  it('responds with 200 OK for /login', async () => {
    res = await request(server).post('/api/auth/login')
    .send({username:'first test', password:'33333'})
    
    expect(res.status).toBe(200)
  })
})

describe('request tests for /register and /login', () => {
  let res
  beforeEach(async () => {
    res = await request(server).post('/api/auth/register')
    .send({username:'second test', password:'12345'})
  })

  it('responds with correct username upon registering', async () => {
    const expected = 'second test'
    const actual = res.body.username
    expect(expected).toEqual(actual)
  })

  it('responds with the correct message upon login', async () => {
    res = await request(server).post('/api/auth/login')
    .send({username:'second test', password:'12345'})
    
    const expected = 'welcome, second test'
    const actual = res.body.message
    expect(expected).toEqual(actual)
  })
})

describe('/jokes tests', () => {
  let res
  let token
  beforeEach(async () => {
    await request(server).post('/api/auth/register')
    .send({username:'third test', password:'33333'})
    res = await request(server).post('/api/auth/login')
    .send({username:'third test', password:'33333'})
    token = res.body.token
    res = await request(server).get('/api/jokes')
    .set('Authorization', `Bearer ${token}`) 
  })

  it('responds with 200 with token', async () => {
    expect(res.status).toBe(200)
  })

  it('responds with 3 jokes', async () => {
    expect(res.body).toHaveLength(3)
  })
})


