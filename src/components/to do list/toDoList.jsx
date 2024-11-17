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
	let baseData = useRef(null);

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
					<button onClick={postTxt} className={styles.btn}>
						Add
					</button>
				</div>
			</div>
			<div id="body" ref={bodyRef} className={styles.body}>
				{txts.map((item) => {
					return (
						<div id={item.id} key={item.id} className={styles.card}>
							<input type="checkbox" />
							<div>
								<p>{item.body}</p>
							</div>
							<AiOutlineDelete
								onClick={() => deleteFunc(item.id)}
								id={item.id}
								className={styles.deleteCard}
							/>
						</div>
					);
				})}
			</div>
		</section>
	);
};

export default ToDoList;
