<script lang="ts" setup>
const { $supabase } = useNuxtApp();

const user = $supabase.auth.user();

const email = ref(null);
const currentPassword = ref(null);
const newPassword = ref(null);
const newPasswordConfirm = ref(null);

const loading = ref(false);
const successMessage = ref(null);
const errorMessage = ref(null);

useHead({
  title: 'Profile',
});

onMounted(() => {
  email.value = user.email;
});

// Require auth
definePageMeta({
  middleware: ['auth'],
});

async function updateProfile() {
  try {
    loading.value = true;

    // Check required fields
    if (!email.value) {
      throw new Error('Email and Password are required.');
    }

    // Simple email format check
    const regex = /.+@.+\..+/g;
    if (!regex.test(email.value)) {
      throw new Error('Invalid Email');
    }

    const { error } = await $supabase.auth.update({
      email: email.value,
    });

    if (error) throw error;

    successMessage.value = 'Please check your email for a verification link.';
  } catch (error) {
    errorMessage.value = 'Oops. Something went wrong.';
  } finally {
    loading.value = false;
  }
}

async function validateCurrentPassword() {
  const { error } = await $supabase.auth.signIn({
    email: email.value,
    password: currentPassword.value,
  });

  if (error) throw new Error('Incorrect password');
}

function confirmNewPassword() {
  if (newPassword.value !== newPasswordConfirm.value) {
    throw new Error('Passwords do not match.');
  }
}

async function changePassword() {
  try {
    errorMessage.value = null;
    loading.value = true;

    // Check required fields
    if (!currentPassword.value || !newPassword.value || !newPasswordConfirm.value) {
      throw new Error('All password fields are required.');
    }

    // Enforce password length
    if (newPassword.value.length < 6 || newPasswordConfirm.value.length < 6) {
      throw new Error('Password must be at least 6 characters.');
    }

    await validateCurrentPassword();
    confirmNewPassword();

    const { error } = await $supabase.auth.update({
      password: newPassword.value,
    });

    if (error) throw new Error('Oops. Something went wrong.');

    successMessage.value = 'Password updated!';
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div>
    <PageTitle>Profile</PageTitle>

    <div v-if="loading">
      <Loader />
    </div>
    <div v-else-if="successMessage">
      <Alert type="success">
        {{ successMessage }}
      </Alert>
    </div>
    <div v-else>
      <Alert v-if="errorMessage" type="error">
        {{ errorMessage }}
      </Alert>

      <form v-on:submit.prevent="updateProfile" class="mb-6">
        <Input label="Email" type="email" add-class="mb-6" v-model="email" required />

        <Button type="submit">Update Email</Button>
      </form>

       <form v-on:submit.prevent="changePassword" class="mb-4">
        <Input
          label="Current Password"
          type="password"
          add-class="mb-4"
          v-model="currentPassword"
          required
        />

        <Input
          label="New Password"
          type="password"
          add-class="mb-4"
          v-model="newPassword"
          required
        />
        <Input
          label="Confirm New Password"
          type="password"
          add-class="mb-4"
          v-model="newPasswordConfirm"
          required
        />

        <Button type="submit">Change Password</Button>
      </form>

      <form v-on:submit.prevent="deleteAccount" class="mb-6">
        <DeleteButton type="button" itemType="user">Delete Account</DeleteButton>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
