<template>
  <div class="orders-management-container">
    <t-card :bordered="false">
      <div class="header-action">
        <t-radio-group v-model="activeStatus" variant="default-filled" @change="handleStatusChange">
          <t-radio-button value="">全部订单</t-radio-button>
          <t-radio-button value="paid">待发货 (已支付)</t-radio-button>
          <t-radio-button value="shipped">已发货</t-radio-button>
          <t-radio-button value="completed">已完成</t-radio-button>
        </t-radio-group>

        <t-button theme="default" @click="fetchOrders">
          <template #icon><t-icon name="refresh" /></template>
          刷新订单
        </t-button>
      </div>

      <t-table
        :data="orderList"
        :columns="columns"
        :row-key="'id'"
        :loading="loading"
        :pagination="pagination"
        style="margin-top: 16px;"
        @page-change="onPageChange"
      >
        <template #status="{ row }">
          <t-tag v-if="row.status === 'paid'" theme="warning" variant="light">待发货</t-tag>
          <t-tag v-else-if="row.status === 'shipped'" theme="primary" variant="light">已发货</t-tag>
          <t-tag v-else-if="row.status === 'completed'" theme="success" variant="light">已完成</t-tag>
          <t-tag v-else theme="default" variant="light">{{ row.status }}</t-tag>
        </template>

        <template #total_amount="{ row }">
          <span class="price-text">¥ {{ Number(row.total_amount).toFixed(2) }}</span>
        </template>

        <template #items="{ row }">
          <div v-for="(item, idx) in row.items" :key="idx" class="order-item-row">
            <span class="item-name">{{ item.title || item.name }}</span>
            <span class="item-qty">x {{ item.quantity || item.count || 1 }}</span>
          </div>
        </template>

        <template #action="{ row }">
          <t-button v-if="row.status === 'paid'" theme="primary" size="small" @click="handleShip(row.id)">
            立即发货
          </t-button>
          <t-button v-else-if="row.status === 'shipped'" theme="success" variant="outline" size="small" @click="handleComplete(row.id)">
            标记完成
          </t-button>
          <span v-else>-</span>
        </template>
      </t-table>
    </t-card>
  </div>
</template>

<script>
import { getOrdersList, updateOrderStatus } from '@/api/shop';

export default {
  name: 'ShopOrderManagement',
  data() {
    return {
      loading: false,
      activeStatus: '',
      orderList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      columns: [
        { colKey: 'id', title: 'ID', width: 60 },
        { colKey: 'order_no', title: '订单编号', width: 220 },
        { colKey: 'total_amount', title: '订单金额', width: 120, cell: 'total_amount' },
        { colKey: 'items', title: '包含商品件数与明细', cell: 'items' },
        { colKey: 'status', title: '状态', width: 120, cell: 'status' },
        { colKey: 'created_at', title: '下单时间', width: 180 },
        { colKey: 'action', title: '操作', width: 120, fixed: 'right', cell: 'action' },
      ],
    };
  },
  mounted() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current,
          pageSize: this.pagination.pageSize,
          status: this.activeStatus || undefined,
        };
        const res = await getOrdersList(params);
        if (res.code === 0) {
          this.orderList = res.data.list;
          this.pagination.total = res.data.total;
        }
      } catch (e) {
        this.$message.error('获取订单列表失败');
      } finally {
        this.loading = false;
      }
    },
    handleStatusChange() {
      this.pagination.current = 1;
      this.fetchOrders();
    },
    onPageChange(pageInfo) {
      this.pagination.current = pageInfo.current;
      this.pagination.pageSize = pageInfo.pageSize;
      this.fetchOrders();
    },
    async handleShip(id) {
      try {
        const res = await updateOrderStatus(id, 'shipped');
        if (res.code === 0) {
          this.$message.success('已更新发货状态');
          this.fetchOrders();
        }
      } catch (e) {
        this.$message.error('发货状态更新失败');
      }
    },
    async handleComplete(id) {
      try {
        const res = await updateOrderStatus(id, 'completed');
        if (res.code === 0) {
          this.$message.success('订单已标记完成');
          this.fetchOrders();
        }
      } catch (e) {
        this.$message.error('更新失败');
      }
    },
  },
};
</script>

<style scoped>
.orders-management-container {
  padding: 16px;
}
.header-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.price-text {
  color: #e54545;
  font-weight: 600;
}
.order-item-row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  line-height: 20px;
}
.item-name {
  color: #333;
}
.item-qty {
  color: #888;
  margin-left: 12px;
}
</style>
