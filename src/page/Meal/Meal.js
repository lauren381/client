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
  CreateMealAction,
  DeleteMealAction,
  GetListMealAction,
  SearchMealAction,
  UpdateMealAction,
} from "../../redux/action/MealAction";

export default function Meal() {
  const dispatch = useDispatch();
  const { arrMeal } = useSelector((root) => root.MealReducer);
  // console.log(arrMeal);
  let emptyProduct = {
    meal_id: "0",
    calories: 0,
    description: "",
    meal_name: "",
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
          // console.log(url);
          const updatedProduct = { ...product, image: url }; // Update achivementLogo property in product object
          setProduct(updatedProduct);
        });
      }
    );
  };

  const [inputValue, setInputValue] = useState("");
  const [text, setText] = useState("Thêm mới thực đơn");
  const [products, setProducts] = useState([]);
  const [detailproductDialog, setdetailproductDialog] = useState(false);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [tempProduct, setTempProduct] = useState({ ...emptyProduct });
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  // console.log(globalFilter);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    const action1 = GetListMealAction();
    dispatch(action1);
  }, []);
  useEffect(() => {
    setProducts(arrMeal);
  }, [arrMeal]);

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };
  const hideDetailDialog = () => {
    setSubmitted(false);
    setdetailproductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const saveProduct = async () => {
    setSubmitted(true);

    if (product.description) {
      let _products = [...products];
      let _product = { ...product };
      _product.calories = Number(_product.calories);
      // console.log(_product);
      if (product.meal_id !== "0") {
        const index = findIndexById(product.id);

        _products[index] = _product;
        const action = await UpdateMealAction(product);
        await dispatch(action);
        setProductDialog(false);
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: `Cập nhật thực đơn ${product.meal_name} thành công`,
          life: 3000,
        });
        setText("Chỉnh sửa thực đơn");
      } else {
        const action = await CreateMealAction(_product);
        await dispatch(action);
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Tạo  mới thực đơn thành công",
          life: 3000,
        });
        setProductDialog(false);
      }

      // setProducts(_products);
      // setProductDialog(false);
      // setProduct(emptyProduct);
    }
  };

  const editProduct = (product) => {
    setText("Chỉnh sửa thực đơn");
    setProduct({ ...product });
    setProductDialog(true);
    setTempProduct({ ...product });
  };
  const detailProduct = (product) => {
    setText("Chi tiết thực đơn");
    setProduct({ ...product });
    setdetailproductDialog(true);
    setTempProduct({ ...product });
  };

  const deleteProduct = async () => {
    const action = await DeleteMealAction(product.meal_id, toast);
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

  const exportCSV = () => {
    dt.current.exportCSV();
  };

  const deleteSelectedProducts = () => {
    let _products = products.filter((val) => !selectedProducts.includes(val));

    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Deleted  Achivement",
      life: 3000,
    });
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
      setInputValue(newValue);
      // Thực hiện các xử lý khác tại đây
    }
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
            setText("Thêm mới thực đơn");
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
        style={{ width: "64px" }}
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
          icon="pi pi-question-circle"
          rounded
          outlined
          className="mr-2"
          tooltip="Xem chi tiết"
          tooltipOptions={{ position: "top" }}
          onClick={() => {
            detailProduct(rowData);
            // confirmDetailProduct(rowData);
          }}
        />
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          tooltip="Sửa"
          tooltipOptions={{ position: "top" }}
          className="mr-2"
          onClick={() => editProduct(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          tooltip="Xóa"
          tooltipOptions={{ position: "top" }}
          outlined
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };

  const formik = useFormik({
    initialValues: {
      mealName: "",
    },
    onSubmit: (value) => {
      // console.log(value);
      const action = SearchMealAction(value);
      dispatch(action);
    },
  });

  useEffect(() => {
    if (formik.values.mealName === "") {
      const action = GetListMealAction();
      dispatch(action);
    }
  }, [formik.values.mealName]);
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0 mb-4">Quản lý thực đơn</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <form onSubmit={formik.handleSubmit}>
          <InputText
            style={{ paddingLeft: "30px" }}
            name="mealName"
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
      {product.meal_name === "" ||
      product.calories <= 0 ||
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
  const deleteProductsDialogFooter = (
    <React.Fragment>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Yes"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteSelectedProducts}
      />
    </React.Fragment>
  );
  // console.log(product.meal_name);
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
          {/*Bảng hiển thị dữ liệu */}
          <DataTable
            ref={dt}
            value={products}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Đang hiển thị {first} đến {last} trong tổng số {totalRecords} thực đơn"
            header={header}
          >
            {/* <Column
              field="meal_id"
              header="Mã"
              sortable
              style={{ minWidth: "11rem" }}
            ></Column> */}

            <Column
              field="meal_name"
              header="Tên thực đơn"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>

            <Column
              field={(item) =>
                item.description.length > 70
                  ? item.description.slice(0, 70) + " ..."
                  : item.description
              }
              header="Miêu tả"
              style={{ minWidth: "12rem" }}
            ></Column>

            <Column
              field="calories"
              header="Calo"
              sortable
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
        {/*popup xem chi tiết */}
        <Dialog
          visible={detailproductDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header={text}
          modal
          className="p-fluid"
          onHide={hideDetailDialog}
        >
          <div className="field">
            <label
              htmlFor="processTypeName"
              className="font-bold"
              style={{ fontWeight: "bold" }}
            >
              Tên thực đơn
            </label>
            <br />
            <InputText
              id="meal_name"
              value={product.meal_name}
              onChange={(e) => onInputChange(e, "meal_name")}
              required
              autoFocus
              disabled
            />
          </div>
          <div className="field">
            <label
              htmlFor="processTypeName"
              className="font-bold"
              style={{ fontWeight: "bold" }}
            >
              Calo
            </label>
            <br />
            <InputText
              type="number"
              id="calories"
              value={product.calories}
              onChange={(e) => onInputChange(e, "calories")}
              required
              disabled
            />
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
              rows={5}
              cols={30}
              disabled
            />
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
            <div
              style={{
                height: "240px",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              <img src={product.image} style={{ height: "100%" }} />
            </div>
          </div>
        </Dialog>
        {/*popup chỉnh sửa */}
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
              Tên thực đơn
            </label>
            <br />
            <InputText
              id="meal_name"
              value={product.meal_name}
              onChange={(e) => onInputChange(e, "meal_name")}
              required
              autoFocus
            />
            {product.meal_id !== "0" && product.meal_name === "" && (
              <small className="p-error">Name is required.</small>
            )}
          </div>
          <div className="field">
            <label
              htmlFor="processTypeName"
              className="font-bold"
              style={{ fontWeight: "bold" }}
            >
              Calo
            </label>
            <br />
            <InputText
              type="number"
              id="calories"
              value={product.calories}
              onChange={(e) => onInputChange(e, "calories")}
              required
              autoFocus
            />
            {product.meal_id !== "0" && product.calories <= 0 && (
              <small className="p-error">Calories is min 1.</small>
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
              rows={5}
              cols={20}
            />
            {product.meal_id !== "0" && product.description === "" && (
              <small className="p-error">Description is required.</small>
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
            {product.meal_id !== "0" && product.image === "" && (
              <small className="p-error">Image is required.</small>
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
                Bạn có chắc chắn muốn xóa thực đơn <b>{product.meal_name}</b>?
              </span>
            )}
          </div>
        </Dialog>
        <Dialog
          visible={deleteProductsDialog}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Confirm"
          modal
          footer={deleteProductsDialogFooter}
          onHide={hideDeleteProductsDialog}
        >
          <div className="confirmation-content">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {product && (
              <span>
                Are you sure you want to delete the selected products?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
}
