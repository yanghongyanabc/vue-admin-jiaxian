<template>
  <reimbursement-detail :is-edit="true" />
</template>

<script>
import ReimbursementDetail from './components/ReimbursementDetail'

export default {
  name: 'EditReimbursement',
  components: { ReimbursementDetail }
}
</script>

