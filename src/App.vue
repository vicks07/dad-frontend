<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
            <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
                :title="user?.firstName || 'Guest'" :subtitle="user?.email || 'Not logged in'">
                <template v-slot:append>
                    <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
                </template>
            </v-list-item>

            <v-divider></v-divider>

            <v-list density="compact" nav>
                <v-list-item v-for="item in menuItems" :key="item.title" :value="item.title" :to="item.to"
                    :prepend-icon="item.icon" :title="item.title"></v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar>
            <v-app-bar-title>Discovery After Divorce</v-app-bar-title>
            <v-spacer></v-spacer>
            <v-btn v-if="!isAuthenticated" color="primary" to="/login">
                Login
            </v-btn>
            <v-btn v-if="!isAuthenticated" color="secondary" to="/register">
                Register
            </v-btn>
            <v-btn v-if="isAuthenticated" icon @click="handleLogout" :loading="loading">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <v-container fluid>
                <router-view></router-view>
            </v-container>
        </v-main>

        <v-footer app>
            <v-row justify="center" no-gutters>
                <v-col class="text-center" cols="12">
                    {{ new Date().getFullYear() }} — <strong>Discovery After Divorce</strong>
                </v-col>
            </v-row>
        </v-footer>
    </v-app>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
    name: 'App',
    setup() {
        const store = useStore()
        const router = useRouter()
        const drawer = ref(true)
        const rail = ref(true)

        const user = computed(() => store.state.auth.user)
        const isAuthenticated = computed(() => store.state.auth.isAuthenticated)
        const loading = computed(() => store.state.loading)

        const menuItems = computed(() => {
            const items = [
                {
                    title: 'Home',
                    icon: 'mdi-home',
                    to: '/'
                }
            ]

            if (isAuthenticated.value) {
                items.push(
                    {
                        title: 'Events',
                        icon: 'mdi-calendar',
                        to: '/events'
                    },
                    {
                        title: 'Matches',
                        icon: 'mdi-heart',
                        to: '/matches'
                    },
                    {
                        title: 'Messages',
                        icon: 'mdi-message',
                        to: '/messages'
                    },
                    {
                        title: 'Profile',
                        icon: 'mdi-account',
                        to: '/profile'
                    }
                )
            }

            return items
        })

        const handleLogout = async () => {
            try {
                await store.dispatch('logout')
                router.push('/login')
            } catch (error) {
                console.error('Logout error:', error)
            }
        }

        return {
            drawer,
            rail,
            user,
            isAuthenticated,
            loading,
            menuItems,
            handleLogout
        }
    }
}
</script>

<style>
.v-application {
    background: linear-gradient(to right, #f5f7fa, #c3cfe2);
}

.v-navigation-drawer {
    background-color: rgba(255, 255, 255, 0.9);
}

.v-app-bar {
    background-color: rgba(255, 255, 255, 0.9);
}

.v-footer {
    background-color: rgba(255, 255, 255, 0.9);
}
</style>