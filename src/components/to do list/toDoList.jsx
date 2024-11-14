import styles from "./toDoList.module.scss";
import {AiOutlineDelete} from "react-icons/ai";
import {FiEdit} from "react-icons/fi";
import {useRef} from "react";
import {useState} from "react";

let ToDoList = () => {
	let bodyRef = useRef(null);
	let addRef = useRef(null);
	let [localData, setLocalData] = useState(
		localStorage.getItem("txts") ? JSON.parse(localStorage.getItem("txts")) : []
	);
	let addLocalFunc = () => {
		let addCardInput = addRef.current.value;
		let newLocalData = [...localData, addCardInput];
		setLocalData(newLocalData);
		localStorage.setItem("txts", JSON.stringify(newLocalData));
		addRef.current.value = "";
	};
	let deleteLocalFunc = (idx) => {
		let childBody = Array.from(bodyRef.current.children);
		let newElement = childBody.forEach((value) => {
			if (value.id == idx) {
				let deleteData = JSON.parse(localStorage.getItem("txts"));
				deleteData.splice(value.id, 1);
				setLocalData(deleteData);
				localStorage.setItem("txts", JSON.stringify(deleteData));
			}
		});
	};

	return (
		<section className={styles.mainSection}>
			<div className={styles.header}>
				<h1>To Do List</h1>
				<input id="searchCard" placeholder="Search" type="text" />
				<div className={styles.addingCont}>
					<input ref={addRef} id="addCard" placeholder="Add card" type="text" />
					<button onClick={addLocalFunc} className={styles.btn}>
						Add
					</button>
				</div>
			</div>
			<div id="body" ref={bodyRef} className={styles.body}>
				{localData.map((item, id) => (
					<div id={id} key={id} className={styles.card}>
						<input type="checkbox" />
						<div>
							<p>{item}</p>
						</div>
						<AiOutlineDelete
							onClick={() => deleteLocalFunc(id)}
							id={id}
							className={styles.deleteCard}
						/>
					</div>
				))}
			</div>
		</section>
	);
};

export default ToDoList;
