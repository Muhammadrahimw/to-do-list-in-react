import {AiOutlineDelete} from "react-icons/ai";
import {FiEdit} from "react-icons/fi";
// icons
import styles from "./toDoList.module.scss";
import axios from "axios";
import {useRef} from "react";
import {useState, useEffect} from "react";

let ToDoList = () => {
	let bodyRef = useRef(null);
	let addRef = useRef(null);
	let searchRef = useRef(null);
	let [txts, setTxts] = useState([]);
	let [inputValue, setInputValue] = useState("");
	let [isActive, setIsActive] = useState(false);
	let [editId, setEditId] = useState(null);
	let baseData = useRef(null);
	let [checkedCount, setCheckedCount] = useState(null);
	let [foiz, setFoiz] = useState(0);

	const checkboxChange = (event, id) => {
		const updatedTxts = txts.map((item) =>
			item.id === id ? {...item, isChecked: event.target.checked} : item
		);
		setTxts(updatedTxts);

		const checkedCount = updatedTxts.filter((item) => item.isChecked).length;
		setFoiz((checkedCount / baseData.current.length) * 100);
	};

	let getTxt = () => {
		axios
			.get(`http://localhost:3000/texts`)
			.then((data) => {
				setTxts(data.data);
				baseData.current = data.data;
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		getTxt();
	}, []);

	let postTxt = () => {
		if (addRef.current.value) {
			let txt = addRef.current.value;
			axios
				.post(`http://localhost:3000/texts`, {
					title: "New Post",
					body: txt,
				})
				.then((data) => {
					console.log("yuborildi: " + data.data);
					getTxt();
				})
				.catch((error) => {
					console.log(error);
				});
			addRef.current.value = "";
		}
	};

	let deleteFunc = (idx) => {
		axios
			.delete(`http://localhost:3000/texts/${idx}`)
			.then((data) => {
				console.log(`o'chirildi: ` + data.data);
				getTxt();
			})
			.catch(`o'chirilmadi :( `);
	};

	let editFunc = (idx) => {
		setEditId(idx);
		setIsActive(!isActive);

		const oldTxt = txts.find((value) => value.id === idx);
		if (oldTxt) {
			addRef.current.value = oldTxt.body;
		} else {
			console.error("Text not found for ID:", idx);
		}
	};

	let updateTxt = async () => {
		if (!editId) {
			console.error("ID is null. Cannot update.");
			return;
		}
		try {
			const response = await axios.put(
				`http://localhost:3000/texts/${editId}`,
				{
					body: addRef.current.value,
				}
			);
			console.log("Updated Data:", response.data);
			addRef.current.value = "";
			getTxt();
			setIsActive(!isActive);
		} catch (error) {
			console.error("Error updating data:", error.response?.data || error);
		}
	};

	useEffect(() => {
		if (baseData.current) {
			let filteredData = baseData.current.filter((item) =>
				item.body.includes(inputValue)
			);
			setTxts(filteredData);
		}
	}, [inputValue]);

	return (
		<section className={styles.mainSection}>
			<div className={styles.header}>
				<h1>To Do List</h1>
				<input
					ref={searchRef}
					id="searchInput"
					placeholder="Search"
					type="text"
					onChange={(e) => setInputValue(e.target.value)}
				/>
				<div className={styles.addingCont}>
					<input ref={addRef} id="addCard" placeholder="Add card" type="text" />
					<button
						style={{display: isActive ? "none" : "block"}}
						onClick={postTxt}
						className={styles.btn}>
						Add
					</button>
					<button
						onClick={updateTxt}
						style={{display: isActive ? "block" : "none"}}
						className={styles.editBtn}>
						Edit
					</button>
				</div>
			</div>
			<div id="body" ref={bodyRef} className={styles.body}>
				{txts.map((item) => {
					return (
						<div id={item.id} key={item.id} className={styles.card}>
							<input
								checked={item.isChecked || false}
								onChange={(e) => checkboxChange(e, item.id)}
								type="checkbox"
							/>
							<div>
								<p>{item.body}</p>
							</div>
							<FiEdit
								onClick={() => {
									editFunc(item.id);
								}}
								id={item.id}
								className={styles.editCard}
							/>
							<AiOutlineDelete
								onClick={() => deleteFunc(item.id)}
								id={item.id}
								className={styles.deleteCard}
							/>
						</div>
					);
				})}
			</div>
			<div className={styles.progress}>
				<div
					style={{
						width: `${foiz}%`,
						backgroundColor: foiz === 100 ? "red" : "gray",
					}}
					id="pers"
					className={styles.pers}></div>
			</div>
		</section>
	);
};

export default ToDoList;
