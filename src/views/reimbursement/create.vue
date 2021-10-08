<template>
  <reimbursement-detail :is-edit="false" />
</template>

<script>
import ReimbursementDetail from './components/ReimbursementDetail'

export default {
  name: 'CreateReimbursement',
  components: { ReimbursementDetail }
}
</script>

