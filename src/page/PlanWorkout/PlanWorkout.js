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
  CreateDailyAction,
  CreateWorkoutAction,
  DeleteDailyAction,
  DeleteWorkoutAction,
  GetListWorkoutAction,
  SearchWorkoutAction,
  UpdateWorkout1Action,
  UpdateWorkoutAction,
} from "../../redux/action/WorkoutAction";
import { GetListMealAction } from "../../redux/action/MealAction";
import { GetListExercisesAction } from "../../redux/action/ExercisesAcrion";
import { GetListCategoryAction } from "../../redux/action/CategoryAction";

export default function PlanWorkout() {
  const dispatch = useDispatch();
  const { arrWorkout } = useSelector((root) => root.WorkoutReducer);
  const { arrMeal } = useSelector((root) => root.MealReducer);
  const { arrExercises } = useSelector((root) => root.ExercisesReducer);
  const { arrCategory } = useSelector((root) => root.CategoryReducer);

  const [hide, setHide] = useState(false);

  const [selectedValueLevel, setSelectedValueLevel] = useState("");
  const [selectedValueCategory, setSelectedValueCategory] = useState("");
  const [selectedCateName, setSelectedCateName] = useState("");

  const handleSelectChangeLevel = (event) => {
    const value = event.target.value; // Lấy giá trị từ event
    setSelectedValueLevel(value); // Cập nhật giá trị được chọn vào state
  };

  const handleSelectChangeCategory = (event) => {
    const value = event.target.value; // Lấy giá trị từ event
    setSelectedValueCategory(value); // Cập nhật giá trị được chọn vào state
  };

  let emptyProduct = {
    plan_id: "0",
    goal: "",
    fitness_level: "",
    category_id: "",
    plan_name: "",
    image: "",
    total_time: 0,
  };

  const [selectedIds, setSelectedIds] = useState([]);

  const [selectedIds1, setSelectedIds1] = useState([]);

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

  const [formCount, setFormCount] = useState(1);
  const [formData, setFormData] = useState([
    { name: "", description: "", meal_id: "", exercise_id: "", day: "" },
  ]);

  const handleAddForm = () => {
    setFormCount(formCount + 1);
    setFormData([
      ...formData,
      { name: "", description: "", meal_id: "", exercise_id: "", day: "" },
    ]);
  };

  const handleInputChange = (event, index) => {
    const { name, value } = event.target;
    const newFormData = [...formData];
    newFormData[index][name] = value;
    setFormData(newFormData);
  };

  const handleMealChange = (event, index) => {
    const selectedOption = event.target.value;
    const newFormData = [...formData];
    newFormData[index].meal_id = selectedOption;
    setFormData(newFormData);
  };

  const handleExerciseChange = (event, index) => {
    const selectedOption = event.target.value;
    const newFormData = [...formData];
    newFormData[index].exercise_id = selectedOption;
    setFormData(newFormData);
  };

  const [text, setText] = useState("Thêm mới kế hoạch tập luyện");
  const [products, setProducts] = useState([]);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [detailProductDialog1, setDetailProductDialog1] = useState(false);
  const [createDailyProductDialog2, setCreateDailyProductDialog2] =
    useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    const action1 = GetListWorkoutAction();
    dispatch(action1);
    const action = GetListMealAction();
    dispatch(action);

    const action2 = GetListExercisesAction();
    dispatch(action2);
    const action3 = GetListCategoryAction();
    dispatch(action3);
  }, []);

  useEffect(() => {
    setProducts(arrWorkout.filter((item) => item.status === "active"));
  }, [arrWorkout]);

  const hideDialog = () => {
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };
  const hideDetailProductDialog = () => {
    setDetailProductDialog1(false);
  };

  const hidecreateDailyProductDialog2 = () => {
    setCreateDailyProductDialog2(false);
  };

  const saveProduct = async () => {
    if (product.plan_name) {
      let _products = [...products];
      let _product = { ...product };
      const plan_meal = selectedIds;
      const plan_exercises = selectedIds1;

      const data = await {
        ...product,
        plan_meal,
        plan_exercises,
        category_id: selectedValueCategory,
      };
      // console.log(data);
      if (product.plan_id !== "0") {
        const index = findIndexById(product.id);
        // console.log(product.category_id);

        _products[index] = _product;
        const updatedData = { ...data }; // Tạo bản sao của data
        // console.log(updatedData);

        if (updatedData.category_id === "") {
          updatedData.category_id = product.category_id;
          // console.log(updatedData);
          const action = await UpdateWorkout1Action(updatedData);
          await dispatch(action);
          setProductDialog(false);
          toast.current.show({
            severity: "success",
            summary: "Thành công",
            detail: `Cập nhật kế hoạch tập luyện ${product.plan_name} thành công`,
            life: 3000,
          });
          setText("Chỉnh sửa kế hoạch tập luyện");
        } else {
          const action = await UpdateWorkoutAction(data);
          await dispatch(action);
          setProductDialog(false);
          toast.current.show({
            severity: "success",
            summary: "Thành công",
            detail: `Cập nhật kế hoạch tập luyện ${product.plan_name} thành công`,
            life: 3000,
          });
          setText("Chỉnh sửa kế hoạch tập luyện");
        }
      } else {
        const data1 = await {
          ...product,
          plan_meal,
          plan_exercises,
          fitness_level: selectedValueLevel,
          category_id: selectedValueCategory,
        };
        const action = await CreateWorkoutAction(data1);
        await dispatch(action);
        toast.current.show({
          severity: "success",
          summary: "Thành công",
          detail: "Tạo  mới kế hoạch tập luyện thành công",
          life: 3000,
        });
        setProductDialog(false);
      }
    }
  };

  const editProduct = (product) => {
    setText("Chỉnh sửa kế hoạch tập luyện");
    const data = product.category_id;
    setProduct({ ...product, category_id: data });
    setSelectedValueLevel(product.fitness_level);
    setSelectedValueCategory(
      arrCategory.find((item) => item.category_id === product.category_id)
        .category_id
    );
    setProductDialog(true);
  };

  const deleteProduct = async () => {
    const action = await DeleteWorkoutAction(product.plan_id);
    await dispatch(action);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: "error",
      summary: "Thành công",
      detail: `Xóa kế hoạch tập luyện ${product.plan_name} thành công`,
      life: 3000,
      options: {
        style: {
          zIndex: 100,
        },
      },
    });
  };

  const createNewDailyProduct2 = async () => {
    const updatedFormData = formData.map((formItem) => ({
      ...formItem,
      plan_id: product.plan_id,
    }));

    const data = { plan_daily: updatedFormData };
    setCreateDailyProductDialog2(false);
    const action = CreateDailyAction(data);
    dispatch(action);
    toast.current.show({
      severity: "success",
      summary: "Thành công",
      detail: `Thêm mới chi tiết thành công`,
      life: 3000,
    });
    setFormCount(1);
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
            setText("Thêm mới kế hoạch tập luyện");
            setHide(false);
          }}
        />
      </div>
    );
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

  const confirmDetailProduct = (product) => {
    setText("Chi tiết kế hoạch");
    setProduct(product);
    const ta = arrCategory.find(
      (item) => item.category_id === product.category_id
    ).category_name;
    setSelectedCateName(ta);
    setDetailProductDialog1(true);
  };
  const confirmCreateNewDailyProduct2 = (product) => {
    setProduct(product);
    setCreateDailyProductDialog2(true);
  };
  //cột chứ action
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-question-circle"
          rounded
          tooltip="Xem chi tiết"
          tooltipOptions={{ position: "top" }}
          outlined
          className="mr-2"
          onClick={() => {
            confirmDetailProduct(rowData);
          }}
        />
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          tooltip="Sửa"
          tooltipOptions={{ position: "top" }}
          className="mr-2"
          onClick={() => {
            editProduct(rowData);
            setHide(true);
          }}
        />

        <Button
          icon="pi pi-ellipsis-v"
          rounded
          outlined
          tooltip="Tạo từng ngày"
          tooltipOptions={{ position: "top" }}
          severity="danger"
          onClick={() => {
            confirmCreateNewDailyProduct2(rowData);
            setSelectedIds([]);
            setSelectedIds1([]);
            setFormData([
              { name: "", description: "", meal_id: "", exercise_id: "" },
            ]);
          }}
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
      plan_name: "",
    },
    onSubmit: (value) => {
      // console.log(value);
      const action = SearchWorkoutAction(value);
      dispatch(action);
    },
  });

  const handleDelete2 = (itemId) => {
    // console.log(itemId);

    const updatedPlanMeals = product.DailyPlanDetails.filter(
      (item) => item.detail_id !== itemId
    );

    const updatedProduct = { ...product, DailyPlanDetails: updatedPlanMeals };
    const action = DeleteDailyAction(itemId);
    dispatch(action);
    const action1 = GetListWorkoutAction();
    dispatch(action1);
    setProduct(updatedProduct);
  };
  useEffect(() => {
    if (formik.values.plan_name === "") {
      const action = GetListWorkoutAction();
      dispatch(action);
    }
  }, [formik.values.plan_name]);

  const header = (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <h4 className="m-0 mb-4">Quản lý kế hoạch tập luyện</h4>
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <form onSubmit={formik.handleSubmit}>
          <InputText
            style={{ paddingLeft: "30px" }}
            name="plan_name"
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
      {product.goal === "" ||
      selectedValueLevel === "" ||
      product.plan_name === "" ||
      selectedValueCategory === "" ||
      product.total_time <= 0 ||
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

  const deleteProductDialogFooter2 = (
    <React.Fragment>
      <Button
        label="Đồng ý"
        icon="pi pi-check"
        severity="danger"
        onClick={createNewDailyProduct2}
      />
      <Button
        label="Hủy bỏ"
        icon="pi pi-times"
        outlined
        onClick={hidecreateDailyProductDialog2}
      />
    </React.Fragment>
  );
  // UI
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
            currentPageReportTemplate="Đang hiển thị {first} đến {last} trong tổng số {totalRecords} kế hoạch tập luyện"
            header={header}
          >
            {/* <Column
              field="plan_id"
              header="Mã"
              sortable
              style={{ minWidth: "11rem" }}
            ></Column> */}
            <Column
              field="plan_name"
              header="Kế hoạch"
              sortable
              style={{ minWidth: "12rem" }}
            ></Column>
            <Column
              field="goal"
              header="Mục tiêu"
              style={{ minWidth: "12rem" }}
            ></Column>

            <Column
              field="total_time"
              header="Thời gian/ngày"
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
              style={{ minWidth: "14rem", marginRight: "50px" }}
            ></Column>
          </DataTable>
        </div>
        {/*chinh sua */}
        <Dialog
          visible={productDialog}
          style={{ width: "80rem" }}
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
              Kế hoạch tập luyện
            </label>
            <br />
            <InputText
              id="plan_name"
              value={product.plan_name}
              onChange={(e) => onInputChange(e, "plan_name")}
              required
              autoFocus
            />
            {product.plan_id !== "0" && product.plan_name === "" && (
              <small className="p-error">Name is required.</small>
            )}
          </div>

          <div className="field" style={{ marginTop: "20px" }}>
            <label
              htmlFor="processTypeName"
              className="font-bold"
              style={{ fontWeight: "bold" }}
            >
              Thời gian/ngày
            </label>
            <br />
            <InputText
              type="number"
              id="total_time"
              value={product.total_time}
              onChange={(e) => onInputChange(e, "total_time")}
              required
              autoFocus
              min={0}
            />
            {product.plan_id !== "0" && product.total_time <= 0 && (
              <small className="p-error">Total time min 1.</small>
            )}
          </div>

          <div className="field" style={{ marginTop: "20px" }}>
            <label
              htmlFor="processTypeName"
              className="font-bold"
              style={{ fontWeight: "bold" }}
            >
              Mức độ
            </label>
            <br />
            <select
              className="form-control"
              onChange={handleSelectChangeLevel}
              defaultValue={product.fitness_level}
            >
              <option value="" disabled>
                Chọn mức độ
              </option>
              <option value="Underweight">Underweight</option>
              <option value="Normal">Normal</option>
              <option value="Overweight">Overweight</option>
              <option value="Obese Level I">Obese Level I</option>
              <option value="Obese Level II">Obese Level II</option>
              <option value="Obese Level III">Obese Level III</option>
            </select>
            {product.plan_id !== "0" && selectedValueLevel === "" && (
              <small className="p-error">Fitness level is required.</small>
            )}
          </div>
          <div className="field mt-5">
            <label
              htmlFor="description"
              className="font-bold"
              style={{ fontWeight: "bold" }}
            >
              Mục tiêu
            </label>
            <InputTextarea
              id="goal"
              value={product.goal}
              onChange={(e) => onInputChange(e, "goal")}
              required
              rows={3}
              cols={20}
            />
            {product.plan_id !== "0" && product.goal === "" && (
              <small className="p-error">Goal is required.</small>
            )}
          </div>

          <div className="field" style={{ marginTop: "20px" }}>
            <label
              htmlFor="processTypeName"
              className="font-bold"
              style={{ fontWeight: "bold" }}
            >
              Loại kế hoạch
            </label>
            <br />
            <select
              className="form-control"
              onChange={handleSelectChangeCategory}
            >
              <option value={product.category_id} disabled>
                Chọn loại kế hoạch
              </option>
              {arrCategory.map((item, index) => (
                <option
                  value={item.category_id}
                  selected={product.category_id === item.category_id}
                >
                  {item.category_name}
                </option>
              ))}
            </select>
            {product.plan_id !== "0" && selectedValueCategory === "" && (
              <small className="p-error">Field is required.</small>
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
            {product.plan_id !== "0" && product.image === "" && (
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

          {hide === false ? (
            <div></div>
          ) : (
            <div>
              {product.DailyPlanDetails?.length !== 0 ? (
                <div
                  style={{
                    margin: "50px 0",
                    fontWeight: 800,
                    fontSize: "30px",
                  }}
                >
                  Thực đơn, bài tập cho mỗi ngày :
                </div>
              ) : (
                <div></div>
              )}
            </div>
          )}
          <div>
            {product.DailyPlanDetails?.map((item, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "60px",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        marginRight: "30px",
                      }}
                    >
                      {item.name}
                    </div>
                    <button
                      style={{
                        padding: "5px 10px",
                        color: "wheat",
                        background: "red",
                      }}
                      onClick={() => {
                        handleDelete2(item.detail_id);
                      }}
                    >
                      Xóa
                    </button>
                  </div>
                  <div style={{ padding: "15px 0", fontWeight: 800 }}>
                    Ngày thứ: {item.day}
                  </div>
                  <div style={{ padding: "15px 0" }}>{item.description}</div>
                  <div style={{ display: "flex" }}>
                    <div style={{ marginRight: "300px" }}>
                      <div>Bài tập: </div>
                      <img
                        src={item.exercise?.image}
                        style={{ width: "250px", height: "200px" }}
                      />
                      <div style={{ fontWeight: 700, padding: "20px 0" }}>
                        {item.exercise?.exercise_name}
                      </div>
                    </div>
                    <div>
                      <div>Thực đơn: </div>
                      <img
                        src={item.meal?.image}
                        style={{ width: "250px", height: "200px" }}
                      />
                      <div style={{ fontWeight: 700, padding: "20px 0" }}>
                        {item.meal?.meal_name}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Dialog>
        {/* //popup thong bao xoa */}
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
                Bạn có chắc chắn muốn xóa kế hoạch tập luyện{" "}
                <b>{product.plan_name}</b>?
              </span>
            )}
          </div>
        </Dialog>
        {/*popup xem chi tiet */}
        <Dialog
          visible={detailProductDialog1}
          style={{ width: "80rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header={text}
          modal
          className="p-fluid"
          onHide={hideDetailProductDialog}
        >
          <div className="field">
            <label
              htmlFor="processTypeName"
              className="font-bold"
              style={{ fontWeight: "bold" }}
            >
              Kế hoạch tập luyện
            </label>
            <br />
            <InputText
              id="plan_name"
              value={product.plan_name}
              onChange={(e) => onInputChange(e, "plan_name")}
              required
              autoFocus
              disabled
            />
          </div>

          <div className="field" style={{ marginTop: "20px" }}>
            <label
              htmlFor="processTypeName"
              className="font-bold"
              style={{ fontWeight: "bold" }}
            >
              Thời gian/ngày
            </label>
            <br />
            <InputText
              type="number"
              id="total_time"
              value={product.total_time}
              onChange={(e) => onInputChange(e, "total_time")}
              required
              autoFocus
              min={0}
              disabled
            />
          </div>

          <div className="field" style={{ marginTop: "20px" }}>
            <label
              htmlFor="processTypeName"
              className="font-bold"
              style={{ fontWeight: "bold" }}
            >
              Mức độ
            </label>
            <br />
            <InputText
              id="total_time"
              value={product.fitness_level}
              onChange={(e) => onInputChange(e, "fitness_level")}
              required
              autoFocus
              disabled
            />
          </div>
          <div className="field mt-5">
            <label
              htmlFor="description"
              className="font-bold"
              style={{ fontWeight: "bold" }}
            >
              Mục tiêu
            </label>
            <InputTextarea
              id="goal"
              value={product.goal}
              onChange={(e) => onInputChange(e, "goal")}
              required
              rows={2}
              cols={20}
              disabled
            />
          </div>

          <div className="field" style={{ marginTop: "20px" }}>
            <label
              htmlFor="processTypeName"
              className="font-bold"
              style={{ fontWeight: "bold" }}
            >
              Loại kế hoạch
            </label>
            <br />
            <InputText
              id="total_time"
              value={selectedCateName}
              required
              autoFocus
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

          {hide === false ? (
            <div></div>
          ) : (
            <div>
              {product.DailyPlanDetails?.length !== 0 ? (
                <div
                  style={{
                    margin: "50px 0",
                    fontWeight: 800,
                    fontSize: "30px",
                  }}
                >
                  Thực đơn, bài tập cho mỗi ngày :
                </div>
              ) : (
                <div></div>
              )}
            </div>
          )}
          <div>
            {product.DailyPlanDetails?.map((item, index) => {
              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "60px",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <div
                      style={{
                        fontSize: "20px",
                        fontWeight: 800,
                        marginRight: "30px",
                      }}
                    >
                      {item.name}
                    </div>
                  </div>
                  <div style={{ padding: "15px 0", fontWeight: 800 }}>
                    Ngày thứ: {item.day}
                  </div>
                  <div style={{ padding: "15px 0" }}>{item.description}</div>
                  <div style={{ display: "flex" }}>
                    <div style={{ marginRight: "300px" }}>
                      <div>Bài tập: </div>
                      <img
                        src={item.exercise?.image}
                        style={{ width: "250px", height: "200px" }}
                      />
                      <div style={{ fontWeight: 700, padding: "20px 0" }}>
                        {item.exercise?.exercise_name}
                      </div>
                    </div>
                    <div>
                      <div>Thực đơn: </div>
                      <img
                        src={item.meal?.image}
                        style={{ width: "250px", height: "200px" }}
                      />
                      <div style={{ fontWeight: 700, padding: "20px 0" }}>
                        {item.meal?.meal_name}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Dialog>

        {/*popup thêm chi tiet từng ngày*/}
        <Dialog
          visible={createDailyProductDialog2}
          style={{ width: "32rem" }}
          breakpoints={{ "960px": "75vw", "641px": "90vw" }}
          header="Thêm chi tiết cho từng ngày"
          modal
          footer={deleteProductDialogFooter2}
          onHide={hidecreateDailyProductDialog2}
        >
          <div>
            {Array.from({ length: formCount }, (_, index) => (
              <div
                key={index}
                className="confirmation-content"
                style={{ borderTop: "1px solid black", marginBottom: "50px" }}
              >
                <div style={{ padding: "20px 0" }}>Tên</div>
                <input
                  className="form-control"
                  type="text"
                  name="name"
                  value={formData[index]?.name}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <div style={{ padding: "20px 0" }}>Ngày thứ</div>
                <input
                  className="form-control"
                  type="number"
                  name="day"
                  value={formData[index]?.day}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <div style={{ padding: "20px 0" }}>Chi tiết</div>
                <textarea
                  className="form-control"
                  type="text"
                  name="description"
                  value={formData[index]?.description}
                  onChange={(e) => handleInputChange(e, index)}
                />
                <div style={{ margin: "30px 0" }}>Thực Đơn:</div>
                <div>
                  <select
                    className="form-control"
                    onChange={(e) => handleMealChange(e, index)}
                    value={formData[index]?.meal_id}
                  >
                    <option>Chọn thực đơn</option>
                    {arrMeal.map((item, exerciseIndex) => (
                      <option
                        className={`form-control ${
                          formData[index]?.meal_id === item.meal_id
                            ? "selected"
                            : ""
                        }`}
                        key={exerciseIndex}
                        value={item.meal_id}
                      >
                        {item.meal_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ margin: "30px 0" }}>Bài Tập:</div>
                <div>
                  <select
                    className="form-control"
                    onChange={(e) => handleExerciseChange(e, index)}
                    value={formData[index]?.exercise_id}
                  >
                    <option>Chọn bài tập</option>
                    {arrExercises.map((item, exerciseIndex) => (
                      <option
                        className={`form-control ${
                          formData[index]?.exercise_id === item.exercise_id
                            ? "selected"
                            : ""
                        }`}
                        key={exerciseIndex}
                        value={item.exercise_id}
                      >
                        {item.exercise_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
            <button onClick={handleAddForm}>Thêm dữ liệu</button>
          </div>
        </Dialog>
      </div>
    </div>
  );
}
