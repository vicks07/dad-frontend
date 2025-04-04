import { createStore } from 'vuex'
import axios from 'axios'

// Create axios instance
const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000/api'
})

// Add token to requests if it exists
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default createStore({
  state: {
    auth: {
      token: localStorage.getItem('token') || null,
      user: JSON.parse(localStorage.getItem('user')) || null,
      isAuthenticated: !!localStorage.getItem('token')
    },
    events: [],
    matches: [],
    messages: [],
    loading: false,
    error: null
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.auth.token = token
      state.auth.isAuthenticated = !!token
      if (token) {
        localStorage.setItem('token', token)
      } else {
        localStorage.removeItem('token')
      }
    },
    SET_USER(state, user) {
      state.auth.user = user
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
      } else {
        localStorage.removeItem('user')
      }
    },
    SET_EVENTS(state, events) {
      state.events = events
    },
    SET_MATCHES(state, matches) {
      state.matches = matches
    },
    SET_MESSAGES(state, messages) {
      state.messages = messages
    },
    SET_LOADING(state, loading) {
      state.loading = loading
    },
    SET_ERROR(state, error) {
      state.error = error
    },
    CLEAR_STATE(state) {
      state.events = []
      state.matches = []
      state.messages = []
      state.loading = false
      state.error = null
    }
  },

  actions: {
    async login({ commit }, credentials) {
      try {
        commit('SET_LOADING', true)
        const response = await api.post('/auth/login', credentials)
        commit('SET_TOKEN', response.data.token)
        commit('SET_USER', response.data.user)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Login failed')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async register({ commit }, userData) {
      try {
        commit('SET_LOADING', true)
        const response = await api.post('/auth/register', userData)
        commit('SET_TOKEN', response.data.token)
        commit('SET_USER', response.data.user)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Registration failed')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async logout({ commit }) {
      try {
        commit('SET_LOADING', true)
        // Clear all state
        commit('CLEAR_STATE')
        commit('SET_TOKEN', null)
        commit('SET_USER', null)
        // Remove token from axios defaults
        delete api.defaults.headers.common['Authorization']
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchEvents({ commit }) {
      try {
        commit('SET_LOADING', true)
        const response = await api.get('/events')
        commit('SET_EVENTS', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch events')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchMatches({ commit }) {
      try {
        commit('SET_LOADING', true)
        const response = await api.get('/matches')
        commit('SET_MATCHES', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch matches')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async fetchMessages({ commit }) {
      try {
        commit('SET_LOADING', true)
        const response = await api.get('/messages')
        commit('SET_MESSAGES', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to fetch messages')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    },

    async updateProfile({ commit }, profileData) {
      try {
        commit('SET_LOADING', true)
        const response = await api.put('/users/profile', profileData)
        commit('SET_USER', response.data)
        return response.data
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.message || 'Failed to update profile')
        throw error
      } finally {
        commit('SET_LOADING', false)
      }
    }
  },

  getters: {
    isAuthenticated: state => state.auth.isAuthenticated,
    currentUser: state => state.auth.user,
    events: state => state.events,
    matches: state => state.matches,
    messages: state => state.messages,
    loading: state => state.loading,
    error: state => state.error
  }
}) 