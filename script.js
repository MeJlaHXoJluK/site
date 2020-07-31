	var tableExist = false;
	var tbl;
	var strId = 0;
	var priceArr = [];
	function updateFoot(){
		if(strId > 0){
			var tmpNewValue = getResSum(3);
			tbl.childNodes[2].childNodes[0].childNodes[1].innerHTML = tmpNewValue;
			tmpNewValue = getResSum(4);
			tbl.childNodes[2].childNodes[0].childNodes[2].innerHTML = tmpNewValue;
		}else{
			tbl.childNodes[2].childNodes[0].childNodes[1].innerHTML = "";
			tbl.childNodes[2].childNodes[0].childNodes[2].innerHTML = "";
		}	
	}
	//Возвращает сумму по столбцу тела таблицы, иначе -1
	function getResSum(iStolb){
		var countRows = tbl.childNodes[3].childNodes.length;
		if(countRows == 0)
			return -1;
		var sum = 0;
		for(var i = 0; i < countRows; ++i)
			sum = Number(sum) + Number(tbl.childNodes[3].childNodes[i].childNodes[Number(iStolb)].innerHTML);
		return sum;
	}
	//Возвращает цену по наименованию товара, иначе-1;
	function getNumberPrice(prd){
		var mn = document.getElementById("S1");
		var k1 = 0;
		for(var i = 3; i < 6; i += 2){
			var k2 = 0;
			for(var j = 1; j < 4; j += 2){
				if(String(prd) === String(mn.childNodes[i].childNodes[j].value)){
					return priceArr[Number((i - 3 - k1) + j - k2 - 1 + ((i - k1 - 3) % 2))];
				}
				k2 += 1;
			}
			k1 += 1;
		}
		return -1;
	}
	// Удаление всех строк из таблицыц
	function remAllTblRows(){
		var orderRows = tbl.childNodes[3];
		var iDel = 0;
		var end = strId;
		for(var i = 0; i < end; ++i)
			if(orderRows.childNodes[iDel].childNodes[0].childNodes[1].checked != true)
				++iDel;
			else {orderRows.removeChild(orderRows.childNodes[iDel]);
					--strId;
			}
		var filCh = document.getElementById("AllStr");
		filCh.checked = false;
		filCh.parentNode.parentNode.removeChild(filCh.parentNode.parentNode.lastChild);
		updateFoot(); // Пересчет итога
	}
	//Удаление строки из таблицы
	function removeTblRow(row){
		tbl.childNodes[3].removeChild(row);
		--strId;
		updateFoot(); // Пересчет итога
	}
	//Создает в текущей ячейке кнопку для удаления строки таблицы
	function crtDelBtn(clN, fun, funParam){
		var delBtn = document.createElement("input");
		delBtn.setAttribute("type", "button");
		delBtn.setAttribute("value", "X");
		delBtn.setAttribute("onclick", fun + "(" + funParam + ")");
		delBtn.className = clN;
		return delBtn;
	}
	//При выборе всех строк отметить все чекбоксы
	function selAllRows(flag){
		for(var i = 0; i < strId; ++i)
			tbl.childNodes[3].childNodes[i].childNodes[0].childNodes[1].checked = flag;
		// Добавляем кнопку для удаления 
		var filCh = document.getElementById("AllStr");
		if(flag){
			filCh.parentNode.parentNode.appendChild(crtDelBtn("delBtn", "remAllTblRows", ""));
		}else if(filCh.parentNode.parentNode.childNodes.length === 2) filCh.parentNode.parentNode.removeChild(filCh.parentNode.parentNode.lastChild);
	}
	function chBoxClick(chBox){
		chBox.click();
	}
	function clickRow(thisRow){
		thisRow.childNodes[0].childNodes[1].click();
	}
	function createRow(){
		var quFieldContent = document.getElementById("q1").value;
		var proName = document.getElementById("S1").value;
		if(proName == "Выбери товар")
			return null;
		
		var quantity;
		if(String(quFieldContent) == "")
			quantity = 1;
		else if(Number(quFieldContent) != 0) quantity = Number(quFieldContent);
		else return null;
		
		//Продукт в корзине?
		var exist = false;
		for(var i = 0; (i < strId) && !exist; ++i)
			if(tbl.childNodes[3].childNodes[i].childNodes[1].innerHTML === String(proName)){
				exist = true;
				tbl.childNodes[3].childNodes[i].childNodes[3].innerHTML = String(Number(tbl.childNodes[3].childNodes[i].childNodes[3].innerHTML) + quantity);
				//Изменить поле сумма
				tbl.childNodes[3].childNodes[i].childNodes[4].innerHTML = Number(tbl.childNodes[3].childNodes[i].childNodes[4].innerHTML) + Number(getNumberPrice(proName)) * quantity;
				return null;
			}
		
		var row = document.createElement("tr");
		var chBox = document.createElement("input");
		chBox.setAttribute("type", "checkbox");
		chBox.setAttribute("onclick", "chBoxClick(this)");
		++strId;
		for(var i = 0; i < 5; ++i)
			row.appendChild(document.createElement("td"));
		
		row.childNodes[0].appendChild(crtDelBtn("delBtn", "removeTblRow", "this.parentNode.parentNode"));
		row.childNodes[0].appendChild(chBox);
		row.childNodes[0].appendChild(document.createElement("text")); 
		row.childNodes[0].childNodes[1].innerHTML = String(strId);
		row.childNodes[1].innerHTML = "" + proName;
		var tmpPrice = getNumberPrice(proName);
		row.childNodes[2].innerHTML = "" + tmpPrice;
		row.childNodes[3].innerHTML = "" + quantity;
		row.childNodes[4].innerHTML = "" + Number(tmpPrice) * quantity;
		row.setAttribute("onclick", "clickRow(this)");
		return row;
	}
	
	function createTable(){
		if(!tableExist){
			tableExist = true;
			
			tbl = document.createElement("table");
			//Убираем случайное выделение текста в таблице
			tbl.setAttribute("onsselectstart", "return false");
			tbl.setAttribute("onmousedown", "return false");
			tbl.className = "Basket";
			tbl = document.getElementById("Order").appendChild(tbl);
			
			var cap = tbl.appendChild(document.createElement("caption"));
			tbl.childNodes[0].innerHTML = "YOUR WISH:";
			cap.className = "Cap";
			
			var tHe = tbl.appendChild(document.createElement("thead"));
			tHe.className = "MyFoot";
			var tFot = tbl.appendChild(document.createElement("tfoot"));
			tFot.className = "MyFoot";
			var tBo = tbl.appendChild(document.createElement("tbody"));
			tBo.className = "MyBodyTable";
			
			var row = document.createElement("tr");
			row = tHe.appendChild(row);
			
			for(var i = 0; i < 5; ++i)
				row.appendChild(document.createElement("td"));
			var lbl = row.childNodes[0].appendChild(document.createElement("label"));
			lbl.innerHTML = "Выбрать все ";
			lbl.setAttribute("row", "AllStr");
			var tmpTd = lbl.appendChild(document.createElement("input"));
			tmpTd.setAttribute("type", "checkbox");
			tmpTd.setAttribute("id", "AllStr");
			tmpTd.setAttribute("onclick", "selAllRows(this.checked)");
			row.childNodes[1].innerHTML = "Продукт";
			row.childNodes[2].innerHTML = "Цена (руб.)";
			row.childNodes[3].innerHTML = "Количество";
			row.childNodes[4].innerHTML = "Сумма";
			//Формируем последнюю строку таблицы
			row = document.createElement("tr");
			row = tFot.appendChild(row);
			
			for(var i = 0; i < 3; ++i)
				row.appendChild(document.createElement("td"));
			row.childNodes[0].innerHTML = "Итого:";
			row.childNodes[0].colSpan = "3";
			row.childNodes[1].innerHTML = "";
			row.childNodes[2].innerHTML = "";
			
			//Добавление строки с заказом в таблицу
			row = createRow();
			if(row != null)
				tbl.childNodes[3].appendChild(row);
			updateFoot();
		}else{
			var row = createRow();
			if(row != null)
				tbl.childNodes[3].appendChild(row);
			updateFoot();
		}
	}
	