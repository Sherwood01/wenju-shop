<template>
  <div class="category-management-container">
    <t-card :bordered="false">
      <div class="header-bar">
        <h3>商品分类管理</h3>
        <t-button theme="primary" @click="handleOpenDialog()">
          <template #icon><t-icon name="add" /></template>
          添加新分类
        </t-button>
      </div>

      <t-table
        :data="categoryList"
        :columns="columns"
        :row-key="'id'"
        :loading="loading"
        style="margin-top: 16px;"
      >
        <template #icon="{ row }">
          <img v-if="row.icon" :src="row.icon" alt="icon" class="cat-icon" />
          <span v-else>-</span>
        </template>

        <template #action="{ row }">
          <t-button theme="primary" variant="text" @click="handleOpenDialog(row)">编辑</t-button>
          <t-popconfirm content="确定要删除该分类吗？" @confirm="handleDelete(row.id)">
            <t-button theme="danger" variant="text">删除</t-button>
          </t-popconfirm>
        </template>
      </t-table>
    </t-card>

    <!-- 分类新增/编辑弹窗 -->
    <t-dialog
      :visible.sync="dialogVisible"
      :header="formData.id ? '编辑分类' : '添加分类'"
      width="480px"
      :on-confirm="handleSubmit"
    >
      <t-form ref="form" :data="formData" label-width="90px">
        <t-form-item label="分类名称" name="name" :rules="[{ required: true, message: '请填写分类名称' }]">
          <t-input v-model="formData.name" placeholder="例如: 笔类文具 / 本册纸品" />
        </t-form-item>
        <t-form-item label="图标 URL" name="icon">
          <t-input v-model="formData.icon" placeholder="请输入图标链接 (可选)" />
        </t-form-item>
        <t-form-item label="排序权值" name="sort_order">
          <t-input-number v-model="formData.sort_order" :min="1" style="width: 100%;" />
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script>
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api/shop';

export default {
  name: 'ShopCategoryManagement',
  data() {
    return {
      loading: false,
      categoryList: [],
      dialogVisible: false,
      formData: {
        id: null,
        name: '',
        icon: '',
        sort_order: 1,
      },
      columns: [
        { colKey: 'id', title: '分类 ID', width: 100 },
        { colKey: 'icon', title: '分类图标', width: 100, cell: 'icon' },
        { colKey: 'name', title: '分类名称' },
        { colKey: 'sort_order', title: '排序权值', width: 120 },
        { colKey: 'action', title: '操作', width: 150, fixed: 'right', cell: 'action' },
      ],
    };
  },
  mounted() {
    this.fetchCategories();
  },
  methods: {
    async fetchCategories() {
      this.loading = true;
      try {
        const res = await getCategories();
        if (res.code === 0) {
          this.categoryList = res.data;
        }
      } catch (e) {
        this.$message.error('获取分类失败');
      } finally {
        this.loading = false;
      }
    },
    handleOpenDialog(row = null) {
      if (row) {
        this.formData = { ...row };
      } else {
        this.formData = { id: null, name: '', icon: '', sort_order: this.categoryList.length + 1 };
      }
      this.dialogVisible = true;
    },
    async handleSubmit() {
      if (!this.formData.name) {
        this.$message.warning('请填写分类名称');
        return;
      }
      try {
        if (this.formData.id) {
          await updateCategory(this.formData.id, this.formData);
          this.$message.success('修改成功');
        } else {
          await createCategory(this.formData);
          this.$message.success('创建成功');
        }
        this.dialogVisible = false;
        this.fetchCategories();
      } catch (e) {
        this.$message.error('保存失败');
      }
    },
    async handleDelete(id) {
      try {
        await deleteCategory(id);
        this.$message.success('删除成功');
        this.fetchCategories();
      } catch (e) {
        this.$message.error('删除失败');
      }
    },
  },
};
</script>

<style scoped>
.category-management-container {
  padding: 16px;
}
.header-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cat-icon {
  width: 36px;
  height: 36px;
  object-fit: contain;
}
</style>
