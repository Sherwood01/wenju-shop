<template>
  <div class="goods-management-container">
    <t-card :bordered="false" class="filter-card">
      <div class="header-action">
        <t-form layout="inline" :data="searchForm" @submit="handleSearch">
          <t-form-item label="商品名称" name="keyword">
            <t-input v-model="searchForm.keyword" placeholder="请输入商品关键字" clearable />
          </t-form-item>
          <t-form-item label="所属分类" name="category_id">
            <t-select v-model="searchForm.category_id" placeholder="全部分类" clearable style="width: 160px;">
              <t-option v-for="item in categoryOptions" :key="item.id" :value="item.id" :label="item.name" />
            </t-select>
          </t-form-item>
          <t-form-item label="上架状态" name="is_put_on_sale">
            <t-select v-model="searchForm.is_put_on_sale" placeholder="全部状态" clearable style="width: 140px;">
              <t-option :value="1" label="已上架" />
              <t-option :value="0" label="已下架" />
            </t-select>
          </t-form-item>
          <t-form-item>
            <t-button theme="primary" type="submit">查询</t-button>
            <t-button theme="default" style="margin-left: 8px;" @click="handleReset">重置</t-button>
          </t-form-item>
        </t-form>

        <t-button theme="primary" @click="handleOpenDialog()">
          <template #icon><t-icon name="add" /></template>
          添加新商品
        </t-button>
      </div>
    </t-card>

    <t-card :bordered="false" class="table-card" style="margin-top: 16px;">
      <t-table
        :data="dataList"
        :columns="columns"
        :row-key="'id'"
        :loading="loading"
        :pagination="pagination"
        @page-change="onPageChange"
      >
        <template #thumb_url="{ row }">
          <img :src="row.thumb_url" alt="product" class="goods-thumb" />
        </template>

        <template #price="{ row }">
          <span class="price-text">¥ {{ Number(row.price).toFixed(2) }}</span>
          <span v-if="row.origin_price" class="origin-price-text">¥ {{ Number(row.origin_price).toFixed(2) }}</span>
        </template>

        <template #is_put_on_sale="{ row }">
          <t-switch :value="Boolean(row.is_put_on_sale)" @change="(val) => handleStatusToggle(row, val)" />
        </template>

        <template #action="{ row }">
          <t-button theme="primary" variant="text" @click="handleOpenDialog(row)">编辑</t-button>
          <t-popconfirm content="确定要删除该商品吗？" @confirm="handleDelete(row.id)">
            <t-button theme="danger" variant="text">删除</t-button>
          </t-popconfirm>
        </template>
      </t-table>
    </t-card>

    <!-- 新增 / 编辑商品弹窗 -->
    <t-dialog
      :visible.sync="dialogVisible"
      :header="formData.id ? '编辑商品' : '添加新商品'"
      width="650px"
      :on-confirm="handleSubmit"
    >
      <t-form ref="form" :data="formData" label-width="100px">
        <t-form-item label="商品标题" name="title" :rules="[{ required: true, message: '请填写商品名称' }]">
          <t-input v-model="formData.title" placeholder="例如: 简约双头荧光笔 (6色装)" />
        </t-form-item>

        <t-form-item label="商品分类" name="category_id" :rules="[{ required: true, message: '请选择所属分类' }]">
          <t-select v-model="formData.category_id" placeholder="请选择商品分类">
            <t-option v-for="item in categoryOptions" :key="item.id" :value="item.id" :label="item.name" />
          </t-select>
        </t-form-item>

        <t-form-item label="销售价格" name="price" :rules="[{ required: true, message: '请填写价格' }]">
          <t-input-number v-model="formData.price" :min="0" :step="0.5" decimal-places="2" style="width: 100%;" />
        </t-form-item>

        <t-form-item label="划线原价" name="origin_price">
          <t-input-number v-model="formData.origin_price" :min="0" :step="0.5" decimal-places="2" style="width: 100%;" />
        </t-form-item>

        <t-form-item label="库存数量" name="stock">
          <t-input-number v-model="formData.stock" :min="0" style="width: 100%;" />
        </t-form-item>

        <t-form-item label="商品主图" name="thumb_url" :rules="[{ required: true, message: '请提供商品主图URL或上传图片' }]">
          <div class="thumb-upload-wrapper">
            <t-input v-model="formData.thumb_url" placeholder="图片 URL 地址" style="flex: 1; margin-right: 8px;" />
            <t-upload
              action="http://localhost:3366/api/upload"
              :show-file-list="false"
              @success="handleUploadSuccess"
            >
              <t-button theme="default">上传图片</t-button>
            </t-upload>
          </div>
          <div v-if="formData.thumb_url" class="preview-box">
            <img :src="formData.thumb_url" alt="preview" />
          </div>
        </t-form-item>

        <t-form-item label="详细介绍" name="description">
          <t-textarea v-model="formData.description" placeholder="请输入商品详细描述信息..." :autosize="{ minRows: 3, maxRows: 6 }" />
        </t-form-item>

        <t-form-item label="上架状态" name="is_put_on_sale">
          <t-radio-group v-model="formData.is_put_on_sale">
            <t-radio :value="1">立即上架</t-radio>
            <t-radio :value="0">暂不上架 (下架)</t-radio>
          </t-radio-group>
        </t-form-item>
      </t-form>
    </t-dialog>
  </div>
</template>

<script>
import { getGoodsList, createGoods, updateGoods, updateGoodsStatus, deleteGoods, getCategories } from '@/api/shop';

export default {
  name: 'ShopGoodsManagement',
  data() {
    return {
      loading: false,
      dataList: [],
      categoryOptions: [],
      searchForm: {
        keyword: '',
        category_id: undefined,
        is_put_on_sale: undefined,
      },
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      dialogVisible: false,
      formData: {
        id: null,
        title: '',
        category_id: null,
        price: 0,
        origin_price: 0,
        stock: 100,
        thumb_url: '',
        description: '',
        is_put_on_sale: 1,
      },
      columns: [
        { colKey: 'id', title: 'ID', width: 70 },
        { colKey: 'thumb_url', title: '主图', width: 90, cell: 'thumb_url' },
        { colKey: 'title', title: '商品标题', ellipsis: true },
        { colKey: 'category_name', title: '所属分类', width: 140 },
        { colKey: 'price', title: '价格', width: 140, cell: 'price' },
        { colKey: 'stock', title: '库存', width: 90 },
        { colKey: 'is_put_on_sale', title: '上架状态', width: 110, cell: 'is_put_on_sale' },
        { colKey: 'action', title: '操作', width: 140, fixed: 'right', cell: 'action' },
      ],
    };
  },
  mounted() {
    this.fetchCategories();
    this.fetchGoods();
  },
  methods: {
    async fetchCategories() {
      try {
        const res = await getCategories();
        if (res.code === 0) {
          this.categoryOptions = res.data;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async fetchGoods() {
      this.loading = true;
      try {
        const params = {
          page: this.pagination.current,
          pageSize: this.pagination.pageSize,
          ...this.searchForm,
        };
        const res = await getGoodsList(params);
        if (res.code === 0) {
          this.dataList = res.data.list;
          this.pagination.total = res.data.total;
        }
      } catch (e) {
        this.$message.error('获取商品列表失败');
      } finally {
        this.loading = false;
      }
    },
    handleSearch() {
      this.pagination.current = 1;
      this.fetchGoods();
    },
    handleReset() {
      this.searchForm = {
        keyword: '',
        category_id: undefined,
        is_put_on_sale: undefined,
      };
      this.handleSearch();
    },
    onPageChange(pageInfo) {
      this.pagination.current = pageInfo.current;
      this.pagination.pageSize = pageInfo.pageSize;
      this.fetchGoods();
    },
    async handleStatusToggle(row, val) {
      const statusVal = val ? 1 : 0;
      try {
        const res = await updateGoodsStatus(row.id, statusVal);
        if (res.code === 0) {
          this.$message.success('状态更新成功');
          row.is_put_on_sale = statusVal;
        }
      } catch (e) {
        this.$message.error('更新状态失败');
      }
    },
    handleOpenDialog(row = null) {
      if (row) {
        this.formData = { ...row };
      } else {
        this.formData = {
          id: null,
          title: '',
          category_id: this.categoryOptions.length > 0 ? this.categoryOptions[0].id : null,
          price: 9.99,
          origin_price: 12.99,
          stock: 100,
          thumb_url: '',
          description: '',
          is_put_on_sale: 1,
        };
      }
      this.dialogVisible = true;
    },
    handleUploadSuccess(res) {
      if (res.code === 0 && res.data && res.data.url) {
        this.formData.thumb_url = res.data.url;
        this.$message.success('图片上传成功');
      }
    },
    async handleSubmit() {
      if (!this.formData.title) {
        this.$message.warning('请填写商品标题');
        return;
      }
      try {
        if (this.formData.id) {
          await updateGoods(this.formData.id, this.formData);
          this.$message.success('修改商品成功');
        } else {
          await createGoods(this.formData);
          this.$message.success('创建商品成功');
        }
        this.dialogVisible = false;
        this.fetchGoods();
      } catch (e) {
        this.$message.error('保存失败');
      }
    },
    async handleDelete(id) {
      try {
        await deleteGoods(id);
        this.$message.success('删除成功');
        this.fetchGoods();
      } catch (e) {
        this.$message.error('删除失败');
      }
    },
  },
};
</script>

<style scoped>
.goods-management-container {
  padding: 16px;
}
.header-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.goods-thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #eee;
}
.price-text {
  color: #e54545;
  font-weight: 600;
  font-size: 15px;
}
.origin-price-text {
  color: #999;
  text-decoration: line-through;
  font-size: 12px;
  margin-left: 6px;
}
.thumb-upload-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
}
.preview-box {
  margin-top: 10px;
}
.preview-box img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #ddd;
}
</style>
