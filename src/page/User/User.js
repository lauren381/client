import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useFormik } from "formik";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DeteleUserAction,
  GetListUserAction,
  SearchUserAction,
} from "../../redux/action/UserAction";
import { storage_bucket } from "./../../firebase";

export default function User() {
  const dispatch = useDispatch();
  const { arrUser } = useSelector((root) => root.UserReducer);
  // console.log(arrUser);
  let emptyProduct = {
    user_id: "0",
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

  const [products, setProducts] = useState([]);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    const action1 = GetListUserAction();
    dispatch(action1);
  }, []);
  useEffect(() => {
    setProducts(arrUser.filter((item) => item.status === "active"));
  }, [arrUser]);

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const deleteProduct = async () => {
    const action = await DeteleUserAction(product.user_id);
    await dispatch(action);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: "error",
      summary: "Thành công",
      detail: `Xóa người dùng ${product.full_name} thành công`,
      life: 3000,
      options: {
        style: {
          zIndex: 100,
        },
      },
    });
  };

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
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    );
  };

  const formik = useFormik({
    initialValues: {
      full_name: "",
    },
    onSubmit: (value) => {
      // console.log(value);
      const action = SearchUserAction(value);
      dispatch(action);
    },
  });

  useEffect(() => {
    if (formik.values.full_name === "") {
      const action = GetListUserAction();
      dispatch(action);
    }
  }, [formik.values.full_name]);
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0 mb-4">Quản lý người dùng</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <form onSubmit={formik.handleSubmit}>
          <InputText
            style={{ paddingLeft: "30px" }}
            name="full_name"
            type="search"
            onChange={formik.handleChange}
            placeholder="Tìm kiếm..."
          />
        </form>
      </span>
    </div>
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
          <DataTable
            ref={dt}
            value={products}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Đang hiển thị {first} đến {last} trong tổng số {totalRecords} người dùng"
            header={header}
          >
            {/* <Column
              field="user_id"
              header="Mã"
              sortable
              style={{ minWidth: "11rem" }}
            ></Column> */}

            <Column
              field="full_name"
              header="Họ Tên"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>

            <Column
              field="email"
              header="Email"
              style={{ minWidth: "12rem" }}
            ></Column>

            <Column
              field="phone_number"
              header="Phone"
              style={{ minWidth: "12rem" }}
            ></Column>

            <Column
              field="weight"
              header="Cân nặng/kg"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="height"
              header="Chiều cao/cm"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="health_index"
              header="Chỉ số/BMI"
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
                Bạn có chắc chắn muốn xóa người dùng <b>{product.full_name}</b>?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
}
