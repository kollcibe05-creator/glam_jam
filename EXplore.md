How to list options: 
```
 <input type="input" list="colors">
      <datalist id="colors">
        <option value="red"></option>
        <option value="blue"></option>
        <option value="green"></option>
      </datalist>
```

Dialog: Q&A
```
 <details>
      <summary>What is the capital city of africa</summary>
        Kenya
    </details>

```
To edit it:
```
details[open] {
    background-color: aliceblue;
    summary::marker {
  content: "+ ";
}
details[open] summary::marker {
  content: "- ";
}

}
``` 
Ruby little text:
```
<ruby>Big Text
       <rt>LittleText</rt>
       <rp>LittleText</rp>
      </ruby>
```
Progess is simpler, meter is complex and more efficient:
```
    <meter min="0" max="100" value="40" low="30" high="70" optimum="80"></meter>

```
Marginal text with input below:
```
 <fieldset>
      <legend>On the margin.</legend>
      Many men, 
      Many many many men, 
      wish death 'pon me,
    </fieldset>
```

Set-up for floating left items:
```
.parent{
    width: 100%;
    overflow: auto;
}
.child{
    height: 15%;
    width: 15%;
    border: solid black;
    border-radius: 5px;
    float: left;
    margin:  15px;
}
```
Dropdown;

```
   <form list="browsers">
        <input list="browsers">
          <datalist id="browsers">
            <option value="Edge"></option>
            <option value="Chrome"></option>
            <option value="Safari"></option>
          </datalist>
        </input>
      </form>
```



