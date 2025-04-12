<template>
    <v-container class="fill-height pa-0 pa-sm-4" fluid>
        <v-row align="center" justify="center" no-gutters>
            <v-col cols="12" sm="10" md="8" lg="6">
                <v-card class="elevation-12 mx-0 mx-sm-4">
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title class="text-body-1 text-sm-h6">Create Account</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text class="pa-4 pa-sm-6">
                        <v-form @submit.prevent="handleSubmit" ref="form">
                            <v-row dense>
                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="firstName" label="First Name" name="firstName"
                                        prepend-icon="mdi-account" :rules="nameRules" required density="comfortable"
                                        variant="outlined" class="mb-2"></v-text-field>
                                </v-col>
                                <v-col cols="12" sm="6">
                                    <v-text-field v-model="lastName" label="Last Name" name="lastName"
                                        prepend-icon="mdi-account" :rules="nameRules" required density="comfortable"
                                        variant="outlined" class="mb-2"></v-text-field>
                                </v-col>
                            </v-row>

                            <v-text-field v-model="email" label="Email" name="email" prepend-icon="mdi-email"
                                type="email" :rules="emailRules" required density="comfortable" variant="outlined"
                                class="mb-2"></v-text-field>

                            <v-text-field v-model="password" label="Password" name="password" prepend-icon="mdi-lock"
                                type="password" :rules="passwordRules" required density="comfortable" variant="outlined"
                                class="mb-2"></v-text-field>

                            <v-text-field v-model="confirmPassword" label="Confirm Password" name="confirmPassword"
                                prepend-icon="mdi-lock-check" type="password" :rules="confirmPasswordRules" required
                                density="comfortable" variant="outlined" class="mb-2"></v-text-field>

                            <v-menu v-model="menu" :close-on-content-click="false" location="bottom" min-width="auto"
                                :max-width="290">
                                <template v-slot:activator="{ props }">
                                    <v-text-field v-model="formattedDate" label="Date of Birth"
                                        prepend-icon="mdi-calendar" readonly v-bind="props" :rules="dateRules" required
                                        density="comfortable" variant="outlined" class="mb-2"></v-text-field>
                                </template>
                                <v-date-picker v-model="dateOfBirth" :max="maxDate" :min="minDate"
                                    @update:model-value="menu = false" elevation="0"></v-date-picker>
                            </v-menu>

                            <v-select v-model="gender" :items="genderOptions" label="Gender"
                                prepend-icon="mdi-gender-male-female" :rules="genderRules" required
                                density="comfortable" variant="outlined" class="mb-2"></v-select>

                            <v-btn color="primary" @click="handleSubmit" :loading="loading" :disabled="loading" block
                                class="mt-4" size="large">
                                Register
                            </v-btn>
                        </v-form>
                    </v-card-text>

                    <v-card-text class="text-center pt-0">
                        <p class="text-body-2 mb-0">
                            Already have an account?
                            <router-link to="/login" class="font-weight-medium">Login here</router-link>
                        </p>
                    </v-card-text>
                </v-card>

                <v-snackbar v-model="snackbar" :color="snackbarColor" timeout="3000" location="top" class="pa-3">
                    {{ snackbarText }}
                </v-snackbar>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'Register',
    setup() {
        const store = useStore()
        const router = useRouter()
        const form = ref(null)
        const menu = ref(false)

        const firstName = ref('')
        const lastName = ref('')
        const email = ref('')
        const password = ref('')
        const confirmPassword = ref('')
        const dateOfBirth = ref('')
        const gender = ref('')

        const snackbar = ref(false)
        const snackbarText = ref('')
        const snackbarColor = ref('error')

        const loading = computed(() => store.getters.loading)
        const error = computed(() => store.getters.error)

        const formattedDate = computed(() => {
            if (!dateOfBirth.value) return ''
            const date = new Date(dateOfBirth.value)
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            })
        })

        const genderOptions = [
            'Male',
            'Female',
            'Other'
        ]

        const nameRules = [
            v => !!v || 'Name is required',
            v => v.length >= 2 || 'Name must be at least 2 characters'
        ]

        const emailRules = [
            v => !!v || 'Email is required',
            v => /.+@.+\..+/.test(v) || 'Email must be valid'
        ]

        const passwordRules = [
            v => !!v || 'Password is required',
            v => v.length >= 8 || 'Password must be at least 8 characters'
        ]

        const confirmPasswordRules = [
            v => !!v || 'Please confirm your password',
            v => v === password.value || 'Passwords must match'
        ]

        const dateRules = [
            v => !!v || 'Date of birth is required',
            v => {
                if (!v) return true
                const age = new Date().getFullYear() - new Date(v).getFullYear()
                return age >= 30 && age <= 55 || 'Age must be between 30 and 55'
            }
        ]

        const genderRules = [
            v => !!v || 'Gender is required'
        ]

        // Set max date to 30 years ago (minimum age requirement)
        const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 30)).toISOString().split('T')[0]
        // Set min date to 55 years ago (maximum age requirement)
        const minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 55)).toISOString().split('T')[0]

        const handleSubmit = async () => {
            const { valid } = await form.value.validate()

            if (!valid) return

            try {
                await store.dispatch('register', {
                    firstName: firstName.value,
                    lastName: lastName.value,
                    email: email.value,
                    password: password.value,
                    dateOfBirth: dateOfBirth.value,
                    gender: gender.value.toLowerCase()
                })

                snackbarColor.value = 'success'
                snackbarText.value = 'Registration successful!'
                snackbar.value = true

                router.push('/emotional-readiness')
            } catch (err) {
                snackbarColor.value = 'error'
                snackbarText.value = error.value || 'Registration failed. Please try again.'
                snackbar.value = true
            }
        }

        return {
            form,
            menu,
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            dateOfBirth,
            formattedDate,
            gender,
            genderOptions,
            loading,
            snackbar,
            snackbarText,
            snackbarColor,
            nameRules,
            emailRules,
            passwordRules,
            confirmPasswordRules,
            dateRules,
            genderRules,
            maxDate,
            minDate,
            handleSubmit
        }
    }
}
</script>

<style scoped>
.v-card {
    border-radius: 12px;
}

@media (max-width: 600px) {
    .v-card {
        border-radius: 0;
        min-height: 100vh;
    }

    .v-container {
        min-height: 100vh;
    }
}

.v-btn {
    text-transform: none;
    letter-spacing: 0.5px;
}

a {
    text-decoration: none;
    color: var(--v-primary-base);
}

.v-text-field :deep(.v-field__input) {
    font-size: 16px !important;
}

.v-text-field :deep(.v-label) {
    font-size: 16px !important;
}
</style>