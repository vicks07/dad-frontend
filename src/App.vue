<template>
    <v-app>
        <!-- Desktop Navigation Drawer -->
        <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false" class="nav-drawer"
            v-if="$vuetify.display.mdAndUp">
            <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
                :title="user?.firstName || 'Guest'" :subtitle="user?.email || 'Not logged in'">
                <template v-slot:append>
                    <v-btn variant="text" icon="mdi-chevron-left" @click.stop="rail = !rail"></v-btn>
                </template>
            </v-list-item>

            <v-divider></v-divider>

            <v-list density="compact" nav>
                <v-list-item v-for="item in menuItems" :key="item.title" :value="item.title" :to="item.to"
                    :prepend-icon="item.icon" :title="item.title" class="touch-target"></v-list-item>
            </v-list>
        </v-navigation-drawer>

        <!-- Mobile App Bar -->
        <v-app-bar :elevation="$vuetify.display.smAndDown ? 2 : 0" class="px-3"
            :class="{ 'mobile-no-radius': $vuetify.display.smAndDown }">
            <v-app-bar-nav-icon v-if="$vuetify.display.smAndDown"
                @click="mobileDrawer = !mobileDrawer"></v-app-bar-nav-icon>

            <v-app-bar-title class="responsive-title">Discovery After Divorce</v-app-bar-title>

            <v-spacer></v-spacer>

            <template v-if="!isAuthenticated">
                <v-btn v-if="$vuetify.display.smAndUp" color="primary" to="/login" class="mr-2">
                    Login
                </v-btn>
                <v-btn v-if="$vuetify.display.smAndUp" color="secondary" to="/register">
                    Register
                </v-btn>
            </template>

            <v-btn v-if="isAuthenticated" icon @click="handleLogout" :loading="loading">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>

        <!-- Mobile Navigation Drawer -->
        <v-navigation-drawer v-model="mobileDrawer" temporary v-if="$vuetify.display.smAndDown" location="left">
            <v-list-item prepend-avatar="https://randomuser.me/api/portraits/men/85.jpg"
                :title="user?.firstName || 'Guest'" :subtitle="user?.email || 'Not logged in'"></v-list-item>

            <v-divider></v-divider>

            <v-list>
                <v-list-item v-for="item in menuItems" :key="item.title" :value="item.title" :to="item.to"
                    :prepend-icon="item.icon" :title="item.title" class="touch-target"
                    @click="mobileDrawer = false"></v-list-item>
            </v-list>
        </v-navigation-drawer>

        <!-- Main Content -->
        <v-main>
            <v-container :class="{
                'pa-0': $vuetify.display.smAndDown,
                'content-with-bottom-nav': $vuetify.display.smAndDown && isAuthenticated
            }" fluid>
                <router-view></router-view>
            </v-container>
        </v-main>

        <!-- Mobile Bottom Navigation -->
        <v-bottom-navigation v-if="$vuetify.display.smAndDown && isAuthenticated" grow class="bottom-nav">
            <v-btn v-for="item in bottomNavItems" :key="item.title" :to="item.to" :value="item.title">
                <v-icon>{{ item.icon }}</v-icon>
                {{ item.title }}
            </v-btn>
        </v-bottom-navigation>

        <!-- Footer -->
        <v-footer v-if="$vuetify.display.mdAndUp" app class="pa-4">
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
import '@/assets/styles/base.css'

export default {
    name: 'App',
    setup() {
        const store = useStore()
        const router = useRouter()
        const drawer = ref(true)
        const rail = ref(true)
        const mobileDrawer = ref(false)

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

        // Bottom navigation items for mobile
        const bottomNavItems = computed(() => {
            if (!isAuthenticated.value) return []

            return [
                {
                    title: 'Home',
                    icon: 'mdi-home',
                    to: '/'
                },
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
                }
            ]
        })

        const handleLogout = async () => {
            try {
                await store.dispatch('logout')
                mobileDrawer.value = false
                router.push('/login')
            } catch (error) {
                console.error('Logout error:', error)
            }
        }

        return {
            drawer,
            rail,
            mobileDrawer,
            user,
            isAuthenticated,
            loading,
            menuItems,
            bottomNavItems,
            handleLogout
        }
    }
}
</script>

<style>
@import '@/assets/styles/base.css';

.v-navigation-drawer__scrim {
    background-color: rgba(0, 0, 0, 0.5);
}

.v-list-item--active {
    background-color: rgb(var(--v-theme-primary));
    color: white;
}

.v-list-item--active:hover {
    background-color: rgb(var(--v-theme-primary));
}

.v-bottom-navigation {
    box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
}

.v-bottom-navigation .v-btn {
    text-transform: none;
}

.v-main {
    background-color: #f5f5f5;
}
</style>