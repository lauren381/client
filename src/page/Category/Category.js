import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useDispatch, useSelector } from "react-redux";
import { storage_bucket } from "./../../firebase";
import { useFormik } from "formik";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

import {
  CreateCategoryAction,
  DeleteCategoryAction,
  GetListCategoryAction,
  SearchCategoryAction,
  UpdateCategoryAction,
} from "../../redux/action/CategoryAction";

export default function Category() {
  const dispatch = useDispatch();
  const { arrCategory } = useSelector((root) => root.CategoryReducer);
  // console.log(arrCategory);
  let emptyProduct = {
    category_id: "0",

    category_name: "",
    description: "",
    image: "",
  };
  const uploadFile = (e) => {
    let file = e.target.files[0];
    let fileRef = ref(storage_bucket, file.name);

    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (err) => console.log(err),
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          console.log(url);
          const updatedProduct = { ...product, image: url }; // Update achivementLogo property in product object
          setProduct(updatedProduct);
        });
      }
    );
  };

  const [text, setText] = useState("Thêm mới loại kế hoạch");
  const [products, setProducts] = useState([]);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    const action1 = GetListCategoryAction();
    dispatch(action1);
  }, []);
  useEffect(() => {
    setProducts(arrCategory);
  }, [arrCategory]);

  const hideDialog = () => {
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const saveProduct = async () => {
    if (product.description) {
      let _products = [...products];
      let _product = { ...product };
      _product.calories = Number(_product.calories);
      // console.log(_product);
      if (product.category_id !== "0") {
        const index = findIndexById(product.id);

        _products[index] = _product;
        const action = await UpdateCategoryAction(product);
        await dispatch(action);
        setProductDialog(false);
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: `Cập nhật loại kế hoạch ${product.category_name} thành công`,
          life: 3000,
        });
        setText("Chỉnh sửa loại kế hoạch");
      } else {
        const action = await CreateCategoryAction(_product);
        await dispatch(action);
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Tạo mới loại kế hoạch thành công",
          life: 3000,
        });
        setProductDialog(false);
      }
    }
  };

  const editProduct = (product) => {
    setText("Chỉnh sửa loại kế hoạch");
    setProduct({ ...product });
    setProductDialog(true);
  };

  const deleteProduct = async () => {
    const action = await DeleteCategoryAction(product.category_id, toast);
    await dispatch(action);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const onInputChange = (e, name) => {
    if (name === "achivementLogo") {
      uploadFile(e); // Call uploadFile function when achivementLogo value changes
    }

    const val = (e.target && e.target.value) || "";
    let _product = { ...product };

    _product[`${name}`] = val;

    setProduct(_product);

    const newValue = e.target.value;

    // Kiểm tra xem newValue có chứa các ký tự đặc biệt không mong muốn
    const forbiddenCharacters = /[@!#$%^&*]/g;

    if (!forbiddenCharacters.test(newValue)) {
      // Thực hiện các xử lý khác tại đây
    }
  };
  const openNew = () => {
    setProduct(emptyProduct);
    setProductDialog(true);
  };
  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Thêm mới"
          icon="pi pi-plus"
          severity="success"
          onClick={() => {
            openNew();
            setText("Thêm mới loại kế hoạch");
          }}
        />
        {/* <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedProducts || !selectedProducts.length} /> */}
      </div>
    );
  };

  // const rightToolbarTemplate = () => {
  //   return (
  //     <Button
  //       label="Tải xuống"
  //       icon="pi pi-upload"
  //       style={{ marginRight: "50px" }}
  //       className="p-button-help"
  //       onClick={exportCSV}
  //     />
  //   );
  // };

  const imageBodyTemplate = (rowData) => {
    return (
      <img
        src={`${rowData.image}`}
        alt={rowData.image}
        className="shadow-2 border-round"
        style={{ width: "241px" }}
      />
    );
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          tooltip="Sửa"
          tooltipOptions={{ position: "top" }}
          outlined
          className="mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          tooltip="Xóa"
          tooltipOptions={{ position: "top" }}
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };

  const formik = useFormik({
    initialValues: {
      category_name: "",
    },
    onSubmit: (value) => {
      // console.log(value);
      const action = SearchCategoryAction(value);
      dispatch(action);
    },
  });

  useEffect(() => {
    if (formik.values.category_name === "") {
      const action = GetListCategoryAction();
      dispatch(action);
    }
  }, [formik.values.category_name]);
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0 mb-4">Quản lý loại kế hoạch</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <form onSubmit={formik.handleSubmit}>
          <InputText
            style={{ paddingLeft: "30px" }}
            name="category_name"
            type="search"
            onChange={formik.handleChange}
            placeholder="Tìm kiếm..."
          />
        </form>
      </span>
    </div>
  );
  const productDialogFooter = (
    <React.Fragment>
      <Button label="Hủy bỏ" icon="pi pi-times" outlined onClick={hideDialog} />
      {product.category_name === "" ||
      product.description === "" ||
      product.image === "" ? (
        <Button
          label="Hoàn thành"
          icon="pi pi-check"
          disabled
          onClick={saveProduct}
        />
      ) : (
        <Button label="Hoàn thành" icon="pi pi-check" onClick={saveProduct} />
      )}
    </React.Fragment>
  );
  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button
        label="Đồng ý"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteProduct}
      />
      <Button
        label="Hủy bỏ"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductDialog}
      />
    </React.Fragment>
  );

  return (
    <div className="app-main__outer" style={{ margin: "20px 30px" }}>
      <div>
        <Toast ref={toast} />
        <div className="card">
          <Toolbar
            className="mb-4"
            left={leftToolbarTemplate}
            // right={rightToolbarTemplate}
          ></Toolbar>

          <DataTable
            ref={dt}
            value={products}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Đang hiển thị {first} đến {last} trong tổng số {totalRecords} loại kế hoạch"
            header={header}
          >
            {/* <Column
              field="category_id"
              header="Mã"
              sortable
              style={{ minWidth: "11rem" }}
            ></Column> */}

            <Column
              field="category_name"
              header="Tên loại kế hoạch"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>

            <Column
              field="description"
              header="Chi tiết"
              style={{ minWidth: "12rem" }}
            ></Column>

            <Column
              style={{ minWidth: "12rem" }}
              field="image"
              header="Hình ảnh"
              body={imageBodyTemplate}
            ></Column>

            <Column
              header="Hành động"
              body={actionBodyTemplate}
              exportable={false}
              style={{ minWidth: "12rem", marginRight: "100px" }}
            ></Column>
          </DataTable>
        </div>

        <Dialog
          visible={productDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header={text}
          modal
          className="p-fluid"
          footer={productDialogFooter}
          onHide={hideDialog}
        >
          <div className="field">
            <label
              htmlFor="processTypeName"
              className="font-bold"
              style={{ fontWeight: "bold" }}
            >
              Tên loại kế hoạch
            </label>
            <br />
            <InputText
              id="category_name"
              value={product.category_name}
              onChange={(e) => onInputChange(e, "category_name")}
              required
              autoFocus
            />
            {product.category_id !== "0" && product.category_name === "" && (
              <small className="p-error">Name is required.</small>
            )}
          </div>

          <div className="field mt-5">
            <label
              htmlFor="description"
              className="font-bold"
              style={{ fontWeight: "bold" }}
            >
              Miêu tả
            </label>
            <InputTextarea
              id="description"
              value={product.description}
              onChange={(e) => onInputChange(e, "description")}
              required
              rows={3}
              cols={20}
            />
            {product.category_id !== "0" && product.description === "" && (
              <small className="p-error">Name is required.</small>
            )}
          </div>
          <div
            className="field mt-5"
            style={{ display: "flex", flexDirection: "column" }}
          >
            <label
              htmlFor="description"
              className="font-bold"
              style={{ fontWeight: "bold" }}
            >
              Hình ảnh
            </label>
            {product.category_id !== "0" && product.image === "" && (
              <small className="p-error">Name is required.</small>
            )}
            <div
              style={{
                height: "240px",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              <img src={product.image} style={{ height: "100%" }} />
            </div>
            <input type="file" className="image" onChange={uploadFile} />
          </div>
        </Dialog>

        <Dialog
          visible={deleteProductDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Thông Báo"
          modal
          footer={deleteProductDialogFooter}
          onHide={hideDeleteProductDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {product && (
              <span>
                Bạn có chắc chắn muốn xóa loại kế hoạch{" "}
                <b>{product.category_name}</b>?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
}
