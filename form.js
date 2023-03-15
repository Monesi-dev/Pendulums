var state=0;
function formModifyer(){
    var pendulum = document.getElementById('subject').value;
    if(state==0){
        state = pendulum;
        var form = document.getElementById('form');
        //number of pendulums
        var br = document.createElement('br');
        var br1 = document.createElement('br');
        var br2= document.createElement('br');
        var label1 = document.createElement('label');
        label1.appendChild(document.createTextNode("Number of pendulums:    "));
        label1.for = "number";
        var input1 = document.createElement('input');
        input1.type = 'range';
        input1.id = 'myRange';
        input1.name = 'number';
        input1.min = '1';
        input1.max = '20';
        input1.value = '15';
        input1.classList.add('slider');
        var div1 = document.createElement('div');
        div1.classList.add("slidecontainer");
        var div2 = document.createElement('b');
        div2.id = "demo";
        label1.appendChild(div2);
        div1.appendChild(input1);
        form.appendChild(br);
        form.appendChild(br1);
        form.appendChild(br2);
        form.appendChild(label1);
        form.appendChild(div1);
        input1.addEventListener('input', updateData);
        //frame rate
        var bra = document.createElement('br');
        var br1a = document.createElement('br');
        var br2a= document.createElement('br');
        var label1a = document.createElement('label');
        label1a.appendChild(document.createTextNode("Framerate: "));
        label1a.for = "numbera";
        var input1a = document.createElement('input');
        input1a.type = 'range';
        input1a.id = 'myRangea';
        input1a.name = 'numbera';
        input1a.min = '70';
        input1a.max = '140';
        input1a.value = '120';
        input1a.classList.add('slider');
        var div1a = document.createElement('div');
        div1a.classList.add("slidecontainer");
        var div2a = document.createElement('b');
        div2a.id = "demoa";
        label1a.appendChild(div2a);
        div1a.appendChild(input1a);
        form.appendChild(bra);
        form.appendChild(br1a);
        form.appendChild(br2a);
        form.appendChild(label1a);
        form.appendChild(div1a);
        input1a.addEventListener('input', updateDataa);
        //timestep
        var brb = document.createElement('br');
        var br1b = document.createElement('br');
        var br2b= document.createElement('br');
        var label1b = document.createElement('label');
        label1b.appendChild(document.createTextNode("Timestep (ms): "));
        label1b.for = "numberb";
        var input1b = document.createElement('input');
        input1b.type = 'range';
        input1b.id = 'myRangeb';
        input1b.name = 'numberb';
        input1b.min = '10';
        input1b.max = '500';
        input1b.value = '40';
        input1b.classList.add('slider');
        var div1b = document.createElement('div');
        div1b.classList.add("slidecontainer");
        var div2b = document.createElement('b');
        div2b.id = "demob";
        label1b.appendChild(div2b);
        div1b.appendChild(input1b);
        form.appendChild(brb);
        form.appendChild(br1b);
        form.appendChild(br2b);
        form.appendChild(label1b);
        form.appendChild(div1b);
        input1b.addEventListener('input', updateDatab);
        //mass 1
        var brc = document.createElement('br');
        var br1c = document.createElement('br');
        var br2c= document.createElement('br');
        var label1c = document.createElement('label');
        label1c.appendChild(document.createTextNode("Mass 1 (kg): "));
        label1c.for = "numberc";
        var input1c = document.createElement('input');
        input1c.type = 'range';
        input1c.id = 'myRangec';
        input1c.name = 'numberc';
        input1c.min = '1';
        input1c.max = '30';
        input1c.value = '10';
        input1c.classList.add('slider');
        var div1c = document.createElement('div');
        div1c.classList.add("slidecontainer");
        var div2c = document.createElement('b');
        div2c.id = "democ";
        label1c.appendChild(div2c);
        div1c.appendChild(input1c);
        form.appendChild(brc);
        form.appendChild(br1c);
        form.appendChild(br2c);
        form.appendChild(label1c);
        form.appendChild(div1c);
        input1c.addEventListener('input', updateDatac);
        //length 1
        var brd = document.createElement('br');
        var br1d = document.createElement('br');
        var br2d= document.createElement('br');
        var label1d = document.createElement('label');
        label1d.appendChild(document.createTextNode("Length 1 (cm): "));
        label1d.for = "numberd";
        var input1d = document.createElement('input');
        input1d.type = 'range';
        input1d.id = 'myRanged';
        input1d.name = 'numberd';
        input1d.min = '50';
        input1d.max = '150';
        input1d.value = '100';
        input1d.classList.add('slider');
        var div1d = document.createElement('div');
        div1d.classList.add("slidecontainer");
        var div2d = document.createElement('b');
        div2d.id = "demod";
        label1d.appendChild(div2d);
        div1d.appendChild(input1d);
        form.appendChild(brd);
        form.appendChild(br1d);
        form.appendChild(br2d);
        form.appendChild(label1d);
        form.appendChild(div1d);
        input1d.addEventListener('input', updateDatad);
        if(pendulum==2){
          //mass 2
          var bre = document.createElement('br');
          var br1e = document.createElement('br');
          var br2e= document.createElement('br');
          var label1e = document.createElement('label');
          label1e.appendChild(document.createTextNode("Mass 2 (kg): "));
          label1e.for = "numbere";
          var input1e = document.createElement('input');
          input1e.type = 'range';
          input1e.id = 'myRangee';
          input1e.name = 'numbere';
          input1e.min = '1';
          input1e.max = '30';
          input1e.value = '10';
          input1e.classList.add('slider');
          var div1e = document.createElement('div');
          div1e.classList.add("slidecontainer");
          var div2e = document.createElement('b');
          div2e.id = "demoe";
          label1e.appendChild(div2e);
          div1e.appendChild(input1e);
          form.appendChild(bre);
          form.appendChild(br1e);
          form.appendChild(br2e);
          form.appendChild(label1e);
          form.appendChild(div1e);
          input1e.addEventListener('input', updateDatae);
          //length 2
          var brf = document.createElement('br');
          var br1f = document.createElement('br');
          var br2f= document.createElement('br');
          var label1f = document.createElement('label');
          label1f.appendChild(document.createTextNode("Length 2 (cm): "));
          label1f.for = "numberf";
          var input1f = document.createElement('input');
          input1f.type = 'range';
          input1f.id = 'myRangef';
          input1f.name = 'numberf';
          input1f.min = '50';
          input1f.max = '150';
          input1f.value = '100';
          input1f.classList.add('slider');
          var div1f = document.createElement('div');
          div1f.classList.add("slidecontainer");
          var div2f = document.createElement('b');
          div2f.id = "demof";
          label1f.appendChild(div2f);
          div1f.appendChild(input1f);
          form.appendChild(brf);
          form.appendChild(br1f);
          form.appendChild(br2f);
          form.appendChild(label1f);
          form.appendChild(div1f);
          input1f.addEventListener('input', updateDataf);
          }
    }
    else if(state==1){
      
    }
}

 // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
function updateData() {
  var slider = document.getElementById("myRange");
  var demo = document.getElementById("demo");
  demo.innerHTML = slider.value;
} 
function updateDataa() {
  var slider = document.getElementById("myRangea");
  var demo = document.getElementById("demoa");
  demo.innerHTML = slider.value;
} 
function updateDatab() {
  var slider = document.getElementById("myRangeb");
  var demo = document.getElementById("demob");
  demo.innerHTML = slider.value;
} 
function updateDatac() {
  var slider = document.getElementById("myRangec");
  var demo = document.getElementById("democ");
  demo.innerHTML = slider.value;
} 
function updateDatad() {
  var slider = document.getElementById("myRanged");
  var demo = document.getElementById("demod");
  demo.innerHTML = slider.value;
} 
function updateDatae() {
  var slider = document.getElementById("myRangee");
  var demo = document.getElementById("demoe");
  demo.innerHTML = slider.value;
} 
function updateDataf() {
  var slider = document.getElementById("myRangef");
  var demo = document.getElementById("demof");
  demo.innerHTML = slider.value;
} 