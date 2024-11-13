import styles from "./toDoList.module.scss";
import {AiOutlineDelete} from "react-icons/ai";
import {FiEdit} from "react-icons/fi";
{
	/* <FiEdit id="editCard" /> */
}
import {useRef} from "react";
import {useState} from "react";

let body = document.getElementById("body");
let ToDoList = () => {
	let addRef = useRef(null);
	let localData = localStorage.getItem("txts")
		? JSON.parse(localStorage.getItem("txts"))
		: [];
	let addLocalFunc = () => {
		let addCardInput = addRef.current.value;
		localData.push(addCardInput);
		localStorage.setItem("txts", JSON.stringify(localData));
		addRef.current.value = "";
		console.log(localData);
		if (localData) {
			// addRefFunc(addCardInput);
		}
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
			<div id="body" className={styles.body}>
				{localData.map((item, id) => {
					<div className={styles.card}>
						<input type="checkbox" />
						<div>
							<p>{item}</p>
						</div>
						<AiOutlineDelete id={id} className={styles.deleteCard} />
					</div>;
				})}
			</div>
		</section>
	);
};

export default ToDoList;
