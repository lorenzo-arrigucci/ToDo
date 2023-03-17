<template>
    <div id="datePicker">
        <DatePicker 
            v-model="date"
            :inputDebounce="300"
            :minDate="minDate"
            :isRequired="required"
            :popover="{ visibility: 'hover', autoHide: true }">
            <template #default="{ inputValue, inputEvents }">
                <input type="text" class="form-control" placeholder="Scadenza" :value="inputValue" v-on="inputEvents" />
            </template>
        </DatePicker>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { DatePicker } from 'v-calendar';
import '../assets/datePicker.css';
import 'v-calendar/style.css';

const date = ref(new Date());

watch(date, (selection, previus) => {
    emit('update', selection);
})

withDefaults(defineProps<{
    minDate?: Date,
    required?: boolean
}>(), {
    minDate: () => new Date(),
    required: true
});

const emit = defineEmits<{
    (e: 'update', value: Date): void
}>();

emit('update', date.value);

</script>

<style lang="scss" scoped>

</style>