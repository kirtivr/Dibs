if (!define(['react', 'jquery', 'filestyle'], function (React, $ ,jQueryFilestyle) {
        var carouselIndex = React.createClass({
            indexTap: function (evt) {
                var selectedLetter = '';
                if(/^[A-Z]$/.test(evt.target.innerHTML))
                selectedLetter = evt.target.innerHTML;
                if(selectedLetter == '') {
                    for (var i = 0; evt.target.childNodes && i < evt.target.childNodes.length; i++) {
                        if (/^[A-Z]$/.test(evt.target.childNodes[i].innerHTML))
                            selectedLetter = evt.target.childNodes[i].innerHTML;
                    }
                }
                if(/^[A-Z]$/.test(selectedLetter)) {
                    var selectedIndex = this.letterToIndexMap[selectedLetter];
                    this.props.carousel.animateCarousel(selectedIndex);
                }
            },

            render: function () {
                var self = this;
                var numberOfLetters = 0;
                var hash = {
                    'A': 0,
                    'B': 0,
                    'C': 0,
                    'D': 0,
                    'E': 0,
                    'F': 0,
                    'G': 0,
                    'H': 0,
                    'I': 0,
                    'J': 0,
                    'K': 0,
                    'L': 0,
                    'M': 0,
                    'N': 0,
                    'O': 0,
                    'P': 0,
                    'Q': 0,
                    'R': 0,
                    'S': 0,
                    'T': 0,
                    'U': 0,
                    'V': 0,
                    'W': 0,
                    'X': 0,
                    'Y': 0,
                    'Z': 0
                };
                this.letterToIndexMap = {};
                for (var i = 0; this.props.names && i < this.props.names.length; i++) {
                    var nameFirstCapitalizedLetter = this.props.names[i].dibName.substring(0, 1).toUpperCase();
                    if (/^[A-Z]$/.test(nameFirstCapitalizedLetter)) {

                        if (hash[nameFirstCapitalizedLetter] == 0) {
                            numberOfLetters++;
                            this.letterToIndexMap[nameFirstCapitalizedLetter] = i;
                        }

                        hash[nameFirstCapitalizedLetter] = hash[nameFirstCapitalizedLetter] + 1;
                    }
                }
                var carouselIndexRows = [];
                var indexStyle = {};
                var letterStyle = {};

                if (numberOfLetters > 0) {
                    var sizeOfCarousel = 600;
                    if (numberOfLetters < 12) {
                        var tablePadding = ( 600 - numberOfLetters * 50 ) / 2;
                        indexStyle['paddingTop'] = tablePadding + 'px';
                        indexStyle['paddingBottom'] = tablePadding + 'px';
                        letterStyle['height'] = 40 + 'px';
                        letterStyle['width'] = 40 + 'px';
                        letterStyle['lineHeight'] = 40 + 'px';
                        letterStyle['marginTop'] = 10 + 'px';
                    }
                    else {
                        var sizePerPixel = sizeOfCarousel / numberOfLetters;
                        var letterHeight = 4 * sizePerPixel / 5;
                        var letterPadding = sizePerPixel / 5;

                        letterStyle['height'] = letterHeight + 'px';
                        letterStyle['width'] = letterHeight + 'px';
                        letterStyle['lineHeight'] = letterHeight + 'px';
                        letterStyle['marginTop'] = letterPadding + 'px';
                    }
                }

                for (var letter in hash) {
                    if (hash.hasOwnProperty(letter) && hash[letter] > 0) {
                        var carouselIndexRow = <div className = "carouselIndexLetter" style = {letterStyle} onClick = {this.indexTap}>  {letter} </div>;
                        carouselIndexRows.push(carouselIndexRow);
                    }
                }


                return <div className = "carouselIndexTable" style={indexStyle}>
                    {carouselIndexRows}
                </div>;
            }
        });

        var carouselList = React.createClass({
            getInitialState: function () {
                return {firstDibIndex: 0};
            },
            componentWillReceiveProps : function()
            {
              this.setState({firstDibIndex:0});
            },

            animateCarousel: function (selectedIndex) {

                if (selectedIndex !== -1 && selectedIndex !== this.state.firstDibIndex) {


                    // one of two conditions -
                    // 1. all dibs have to be removed and replaced with new dibs
                    // 3. <5 dibs to be removed and replaced with new dibs
                    var dibs = $('.dibItem');
                    var self = this;

                    // partial removal
                    // all dibs to be removed and replaced with new dibs
                    var dibNumDiff = Math.abs(selectedIndex - this.state.firstDibIndex);
                    var shownDibPressed = false;
                    var numDibsToBeEdited = 0;
                    var numDibs = ( this.props.data.length < 5 ? this.props.data.length : 5 );
                    var j = 0;
                    for (var i = this.state.firstDibIndex ; this.props.data &&  j < numDibs; j++)
                    {
                        if(i == selectedIndex) {
                            shownDibPressed = true;
                            numDibsToBeEdited = j;
                        }
                        i = (i + 1)%(this.props.data.length);
                    }
                    var bottomDibsToBeRemoved = [];
                    if(!shownDibPressed)
                        bottomDibsToBeRemoved = $(dibs).slice(0,numDibs);
                    else if (numDibsToBeEdited > 0)
                        bottomDibsToBeRemoved = $(dibs).slice(numDibs-numDibsToBeEdited,numDibs);


                    bottomDibsToBeRemoved.wrap('<div id="elementsToBeRemoved" class="shuffledOutElements"></div>');

                    $('#elementsToBeRemoved').animate({
                        marginTop: "700px",
                        easing: "linear",
                        queue: "shuffle"
                    }, 700, function () {
                        if ($('.selected'))
                            $('.selected').removeClass('selected');
                        var dibsAddedLen = numDibsToBeEdited;
                        $('.carouselList').css("top", -30 * numDibsToBeEdited);
                        self.setState({firstDibIndex:selectedIndex},function()
                        {
                            if(self.props.loggedInUser)
                            $('.carouselList').animate({top:"25px",easing:"linear",queue:"shuffle"},500);
                            else
                                $('.carouselList').animate({top:"0px",easing:"linear",queue:"shuffle"},500);
                        });
                    }); // remove divs below selected dib from DOM after animating them .


                }
            },
            render: function () {
                var self = this;
                var carouselItem = React.createClass({
                    render: function () {
                        var handleClickEvent = function (ev) {
                            var dibClicked = ev.target.innerHTML;
                            if ($('.selected'))
                                $('.selected').removeClass('selected');
                            $(ev.target).addClass('selected');
                            var selectedIndex = -1;
                            for (var i = 0; self.props.data && i < self.props.data.length; i++) {
                                if (dibClicked === self.props.data[i].dibName) {
                                    selectedIndex = i;
                                    break;
                                }
                            }
                            self.animateCarousel(selectedIndex);
                        };

                        var dibName = null;
                        var dibImage = null;

                        var imageHeight = 600 - 30 * this.props.numSpans;

                        var imageStyle = {'height' : (imageHeight+5)+'px'};

                        if (this.props.lastNode) {
                            var dibName = <span className = "dibName selected" onClick = {handleClickEvent}>
                                                      {this.props.dibName}
                            </span>;
                            var dibImage = React.DOM.img({
                                className: "dibImageShown",
                                style: imageStyle,
                                src: 'img/' + this.props.userCode +'/'+ this.props.dibImageSrc
                            });
                        }
                        else {
                            var dibName = <span className = "dibName" onClick = {handleClickEvent}>
                                                      {this.props.dibName}
                            </span>;
                            var dibImage = React.DOM.img({
                                className: "dibImageHidden"
                                //src: 'img/'+this.props.userCode +'/'+ this.props.dibImageSrc
                            });
                        }




                        var dibStyle = {marginBottom: "0px"};
                        var dib = <div className = "dibItem" style={dibStyle}>
                                                  {dibName}
                                                  {dibImage}
                        </div>;

                        return dib;
                    }
                });

                var carouselItemNodes = [];
                var j = 0;
                var numDibs = -1;
                if (this.props.data)
                numDibs = this.props.data.length;

                var spanElements = (numDibs > 5 ? 5 : numDibs)+( this.props.loggedInUser? 1 : 0 );
                for (var i = this.state.firstDibIndex ; numDibs > 0 && j < 5 && j < numDibs; j++ )
                {
                    //debugger;
                    var carItemData = this.props.data[i];
                    if(i==this.state.firstDibIndex)
                    {
                        var carouselItemNode = < carouselItem dibName = {carItemData.dibName} dibImageSrc = {carItemData.imageName} userCode = {this.props.userCode} lastNode={true} numSpans = {spanElements}/>;

                        carouselItemNodes.unshift(carouselItemNode);

                    }
                    else
                    {
                        var carouselItemNode = < carouselItem dibName = {carItemData.dibName} dibImageSrc = {carItemData.imageName} userCode = {this.props.userCode} lastNode = {false} numSpans = {spanElements}/>;
                        carouselItemNodes.unshift(carouselItemNode);
                    }
                    i = ( i + 1 ) % numDibs;
                }

                if(this.props.loggedInUser)
                carouselStyle = {
                    top: "25px"
                };
                else
                carouselStyle = {
                    top: "0px"
                };

                return <div className="carouselList" style = {carouselStyle}>
                                                  {carouselItemNodes}
                </div>;
            }
        });


        var carousel = React.createClass({
            getInitialState: function () {
                return {userCode: this.props.userCode}
            },
            setResponse: function(data)
            {
                this.response = data;
            },
            getResponse: function()
            {
              if(this.response)
                return this.response;
              else
                return null;

            },
            loadDataForUser: function (userCode) {
                var self = this;
                var data = new FormData();
                data.append("userCode",userCode);
                $.ajax({
                    url: 'loadDibs.php',
                    type:"POST",
                    dataType: 'json',
                    data:data,
                    contentType: false,
                    processData: false,
                    success: function (response) {
                        var unsortedResponse = response;
                        // applying quick sort
                        this.qSort(response, 0, response.length - 1);
                        this.setResponse({data: response});
                        this.setState({userCode: userCode},
                                        function()
                                        {
                                            $('.userSelectPanel').hide(0,function()
                                            {
                                                if($('.addDibInput').is(":visible"))
                                                    $('.addDibInput').hide();
                                                if(userCode == self.props.userCode) {

                                                    $('.addDibtoDibs').fadeIn(1000);

                                                }
                                                $('.carousel').fadeIn(1000);
                                            });


                                        });


                    }.bind(this),
                    error: function (a, b, c) {
                    }
                });

            },
            prepareUpload : function(event)
            {
                this.files = event.target.files;
            },
            uploadFiles : function(event)
            {
                var self = this;
                event.stopPropagation(); // Stop stuff happening
                event.preventDefault(); // Totally stop stuff happening

                // Create a formdata object and add the files
                var dibName = $('.inputDibName').val();

                var data = new FormData();

                $.each(this.files,
                    function(key,value)
                    {
                        data.append(key,value);
                    }
                );

                data.append('dibName',dibName);
                data.append('userCode',this.props.userCode);

                $.ajax({
                    url: 'submit.php?files',
                    type: 'POST',
                    data: data,
                    cache: false,
                    //dataType: 'json',
                    processData: false, // Don't process the files
                    contentType: false, // Set content type to false as jQuery will tell the server its a query string request
                    success: function(data, textStatus, jqXHR)
                    {
                        if(typeof data.error === 'undefined')
                        {
                            // Success so call function to process the form
                            $('.addDibInput').hide(200,
                                function()
                                {
                                    $('.inputDibName').val('');
                                    if($('<input class="file">'))
                                        $('<input class="file">').val('');
                                    $('.addDibtoDibs').fadeIn(200);
                                });
                            self.loadDataForUser(self.props.userCode);
                        }
                        else
                        {
                            // Handle errors here
                            console.log('ERRORS: ' + data.error);
                        }
                    },
                    error: function(jqXHR, textStatus, errorThrown)
                    {
                        // Handle errors here
                        console.log('ERRORS: ' + textStatus);
                        // STOP LOADING SPINNER
                    }
                });

            },
            componentDidMount: function () {
                this.loadDataForUser(this.state.userCode);
                // Add events
                $('input[type=file]').on('change', this.prepareUpload);
                $('form').on('submit', this.uploadFiles);
                $("input[type=file]").filestyle({
                    image: "./img/upload.png",
                    imageheight : 21,
                    imagewidth : 35,
                    width : 125,
                    left: 335,
                    top: 2
                });
            },
            qSort: function (arr, left, right) {
                if (right > left) {
                    var index = this.qSortPartition(arr, left, right);
                    this.qSort(arr, 0, index - 1);
                    this.qSort(arr, index + 1, right);
                }
            },
            qSortPartition: function (arr, left, right) {
                var pivot = arr[left].dibName;
                var i = left;
                var j = right;
                while (true) {

                    while (arr[i].dibName.localeCompare(pivot) <= 0) {
                        if (i >= right)break;
                        i++;
                    }

                    while (arr[j].dibName.localeCompare(pivot) > 0) {
                        if (j <= left)break;
                        j--;
                    }

                    if (i >= j)break;
                    else {
                        var temp = arr[i];
                        arr[i] = arr[j];
                        arr[j] = temp;
                    }
                }
                if (j == left) return j;
                else {
                    var temp = arr[left];
                    arr[left] = arr[j];
                    arr[j] = temp;
                }
                return j;

            },


            onHomeButtonClick: function()
            {
                if($('.carousel').is(":visible")) {

                    $('.carousel').fadeOut(1000, function () {
                        if($('.addDibtoDibs').is(":visible"))
                            $('.addDibtoDibs').hide();
                            if($('.addDibInput').is(":visible"))
                                $('.addDibInput').hide();
                            $('.userSelectPanel').fadeIn(800);

                    });
                }

            },

            onAddDeleteButtonClick: function()
            {
                $('.addDibInput').hide(200,
                function()
                {
                     $('.inputDibName').val('');
                     if($('.file'))
                         $('.file').val('');
                     $('.addDibtoDibs').fadeIn(200);
                });
            },

            render: function () {
                var self = this;
                if (!this.response)
                this.response = {data:[]};
                var loggedInUser =  this.state.userCode == this.props.userCode ;
                var dib = null;
                var addDibText = <span className = "addDibTextStyle">Add dib </span>;
                if(loggedInUser) {
                    dib = <div className = "addDibtoDibs" onClick = {
                        function () {
                            $('.addDibtoDibs').hide(200,
                                function () {
                                    $('.addDibInput').fadeIn(200);
                                });

                        }
                        }>{addDibText}</div>;

                    var dibNameInputBox = <form className = "addDibInput">
                            <input className = "inputDibName" type = "text">
                            </input>
                            <input  type = "file"> </input>
                            <input type = "submit"  className = "submitDibs"> </input>
                            <img src = "./img/deleteButton.png" className = "deleteButton" onClick = {self.onAddDeleteButtonClick} ></img>
                        </form>
                        ;
                }
                var self = this;
                var usersList = this.props.userData.map(
                    function(user)
                {   var dibUser = null;
                    if(self.props.userCode == user.userCode) {
                        dibUser = <div className = "dibUser" onClick = {
                            function()
                            {
                                self.loadDataForUser(user.userCode);
                            }
                          }>

                            <div className = "dibUserName">
                                Self
                            </div>
                        </div>
                    }
                    else {
                        dibUser = <div className = "dibUser">
                            <div className = "dibUserName" onClick = {
                                function()
                                {
                                    self.loadDataForUser(user.userCode);
                                }
                                }>
                                {user.userName}
                            </div>
                        </div>
                    }
                    return dibUser;
                });
                var userSelectPanel =
                    <div className = "userSelectPanel">
                    <div className = "userSelectHText">Hello  ,  {this.props.userName} !!</div>
                    <br/>
                    <div className = "userSelectPText">Please  select  a  user  to  view  their  dibs  ..</div>
                        <br />
                    {usersList}
                    </div>;




                return <div className="dibsContent">
                    <carouselIndex names = {this.response.data} carousel = {this.refs.thecarousel} ref = "indexbar"/>
                    <div className = "carouselWrapper">
                        <div className = "carouselSlider">
                                           {dib}
                                           {dibNameInputBox}
                            <div className = "carousel">
                                <carouselList data = {this.response.data} userCode = {this.state.userCode} loggedInUser = {loggedInUser} indexBar = {this.refs.indexbar} ref="thecarousel"/>
                            </div>
                            {userSelectPanel}
                            <img src = "img/home.png" className = "homeButton" onClick = {this.onHomeButtonClick} />
                        </div>
                    </div>
                </div>
            }
        });

        return carousel;
    })) ;
