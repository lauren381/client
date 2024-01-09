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
  CreateExercisesAction,
  DeleteExercisesAction,
  GetListExercisesAction,
  SearchExercisesAction,
  UpdateExercisesAction,
} from "../../redux/action/ExercisesAcrion";

export default function Exercises() {
  const dispatch = useDispatch();
  const { arrExercises } = useSelector((root) => root.ExercisesReducer);
  // console.log(arrExercises);
  let emptyProduct = {
    exercise_id: "0",
    exercise_name: "",
    description: "",
    video_url: "",
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

  const [text, setText] = useState("Thêm mới bài tập");
  const [products, setProducts] = useState([]);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const toast = useRef(null);
  const dt = useRef(null);

  const VideoBodyTemplate = (rowData) => {
    const isYouTubeURL =
      rowData.video_url && rowData.video_url.includes("youtube.com");

    if (isYouTubeURL) {
      const videoId = rowData.video_url.split("v=")[1];

      return (
        <div className="video-responsive">
          <iframe
            width="320"
            height="240"
            src={`https://www.youtube.com/embed/${videoId}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    } else if (rowData.video_url) {
      return (
        <video width="320" height="240" controls>
          <source src={rowData.video_url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    } else {
      return <span>No video available</span>;
    }
  };

  useEffect(() => {
    const action1 = GetListExercisesAction();
    dispatch(action1);
  }, []);

  useEffect(() => {
    setProducts(arrExercises);
  }, [arrExercises]);

  const openNew = () => {
    setProduct(emptyProduct);
    setProductDialog(true);
  };

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
      if (product.exercise_id !== "0") {
        const index = findIndexById(product.id);

        _products[index] = _product;
        const action = await UpdateExercisesAction(product);
        await dispatch(action);
        setProductDialog(false);
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: `Cập nhật bài tập ${product.exercise_name} thành công`,
          life: 3000,
        });
        setText("Chỉnh sửa bài tập");
      } else {
        const action = await CreateExercisesAction(_product);
        await dispatch(action);
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Tạo  mới bài tập thành công",
          life: 3000,
        });
        setProductDialog(false);
      }
    }
  };

  const editProduct = (product) => {
    setText("Chỉnh sửa bài tập");
    setProduct({ ...product });
    setProductDialog(true);
  };

  const deleteProduct = async () => {
    const action = await DeleteExercisesAction(product.exercise_id, toast);
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

  const leftToolbarTemplate = () => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          label="Thêm mới"
          icon="pi pi-plus"
          severity="success"
          onClick={() => {
            openNew();
            setText("Thêm mới bài tập");
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
      exercisesName: "",
    },
    onSubmit: (value) => {
      // console.log(value);
      const action = SearchExercisesAction(value);
      dispatch(action);
    },
  });

  useEffect(() => {
    if (formik.values.exercisesName === "") {
      const action = GetListExercisesAction();
      dispatch(action);
    }
  }, [formik.values.exercisesName]);
  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0 mb-4">Quản lý bài tập</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <form onSubmit={formik.handleSubmit}>
          <InputText
            style={{ paddingLeft: "30px" }}
            name="exercisesName"
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
      {product.exercise_name === "" ||
      product.video_url === "" ||
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
            rowsPerPageOptions={[5, 10, 15]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Đang hiển thị {first} đến {last} trong tổng số {totalRecords} bài tập"
            header={header}
          >
            {/* <Column
              field="exercise_id"
              header="Mã"
              sortable
              style={{ minWidth: "11rem" }}
            ></Column> */}

            <Column
              field="exercise_name"
              header="Tên bài tập"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>

            <Column
              field="description"
              header="Miêu tả"
              style={{ minWidth: "12rem" }}
            ></Column>

            <Column
              field="video_url"
              header="Video"
              body={VideoBodyTemplate}
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
              Tên bài tập
            </label>
            <br />
            <InputText
              id="exercise_name"
              value={product.exercise_name}
              onChange={(e) => onInputChange(e, "exercise_name")}
              required
              autoFocus
            />
            {product.exercise_id !== "0" && product.exercise_name === "" && (
              <small className="p-error">Name is required.</small>
            )}
          </div>
          <div className="field">
            <label
              htmlFor="processTypeName"
              className="font-bold"
              style={{ fontWeight: "bold" }}
            >
              Video
            </label>
            <br />
            <InputText
              id="video_url"
              value={product.video_url}
              onChange={(e) => onInputChange(e, "video_url")}
              required
              autoFocus
            />
            {product.exercise_id !== "0" && product.video_url === "" && (
              <small className="p-error">Video url is required.</small>
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
            {product.exercise_id !== "0" && product.description === "" && (
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
            {product.exercise_id !== "0" && product.image === "" && (
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
                Bạn có chắc chắn muốn xóa bài tập <b>{product.exercise_name}</b>
                ?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
}
