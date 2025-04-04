<template>
    <v-container>
        <v-row>
            <v-col cols="12" class="text-center">
                <h1 class="text-h1 mb-4">404</h1>
                <h2 class="text-h4 mb-6">Page Not Found</h2>
                <p class="text-body-1 mb-8">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <v-btn color="primary" size="large" to="/">
                    Return Home
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'NotFound'
};
</script>