<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12">
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title>Login</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text>
                        <v-form @submit.prevent="handleSubmit" ref="form">
                            <v-text-field v-model="email" label="Email" name="email" prepend-icon="mdi-email"
                                type="email" :rules="emailRules" required></v-text-field>

                            <v-text-field v-model="password" label="Password" name="password" prepend-icon="mdi-lock"
                                type="password" :rules="passwordRules" required></v-text-field>
                        </v-form>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="handleSubmit" :loading="loading" :disabled="loading">
                            Login
                        </v-btn>
                    </v-card-actions>

                    <v-card-text class="text-center">
                        <p class="mb-0">
                            Don't have an account?
                            <router-link to="/register">Register here</router-link>
                        </p>
                    </v-card-text>
                </v-card>

                <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000">
                    {{ snackbarText }}
                </v-snackbar>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default {
    name: 'Login',
    setup() {
        const store = useStore()
        const router = useRouter()
        const route = useRoute()
        const form = ref(null)
        const email = ref('')
        const password = ref('')
        const snackbar = ref(false)
        const snackbarText = ref('')
        const snackbarColor = ref('error')

        const loading = computed(() => store.getters.loading)
        const error = computed(() => store.getters.error)

        const emailRules = [
            v => !!v || 'Email is required',
            v => /.+@.+\..+/.test(v) || 'Email must be valid'
        ]

        const passwordRules = [
            v => !!v || 'Password is required',
            v => v.length >= 8 || 'Password must be at least 8 characters'
        ]

        const handleSubmit = async () => {
            const { valid } = await form.value.validate()

            if (!valid) return

            try {
                await store.dispatch('login', {
                    email: email.value,
                    password: password.value
                })

                snackbarColor.value = 'success'
                snackbarText.value = 'Login successful!'
                snackbar.value = true

                // Redirect to the intended route or home
                const redirectPath = route.query.redirect || '/'
                router.push(redirectPath)
            } catch (error) {
                snackbarColor.value = 'error'
                snackbarText.value = error.response?.data?.msg || 'Login failed. Please try again.'
                snackbar.value = true
            }
        }

        return {
            form,
            email,
            password,
            loading,
            error,
            emailRules,
            passwordRules,
            handleSubmit,
            snackbar,
            snackbarText,
            snackbarColor
        }
    }
}
</script>

<style scoped>
.v-card {
    border-radius: 8px;
}

.v-card-text {
    padding: 24px;
}

.v-btn {
    text-transform: none;
    letter-spacing: 0.5px;
}

a {
    text-decoration: none;
    color: var(--v-primary-base);
}
</style>