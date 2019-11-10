/**
 * Created by singhraj on 10/14/15.
 */

function turnToImage(oController,oElement){
    var keyName = gameController.keyName;
    oController.stackedData.text('');
    $(oController.stackedData.parent()[0]).addClass(keyName.CHANGE_VIEW);
    oController.stackedData.removeClass(keyName.ANSWER_CLASS);
    oController.stackedData.addClass(keyName.QUESTION_CLASS);
    oController.stackedData = null;
    oElement.text('');
    oElement.removeClass(keyName.ANSWER_CLASS);
    oElement.addClass(keyName.QUESTION_CLASS);
    $(oElement.parent()[0]).addClass(keyName.CHANGE_VIEW);
}


function MouseEvent(dragElement,puzzleArea){

    var maxWidth = 0,
        maxHeight = 0;
    var dragMouse = function(e){
        var flag = false;
        var x = e.clientX,
            y = e.clientY,
            oPuzzleArea = $("#"+puzzleArea);
        var widthProperty = parseFloat(oPuzzleArea.css('min-width'));
        var heightProperty = parseFloat(oPuzzleArea.css('min-height'));
        if((x > maxWidth || y > maxHeight) && (widthProperty < 70 && heightProperty < 75)) {
            flag = true;
            widthProperty = parseFloat(widthProperty) + 0.2 + "%";
            heightProperty = parseFloat(heightProperty) + 0.2 + "%";
        }else if((x < maxWidth || y < maxHeight) && (widthProperty >  7 && heightProperty > 10 )){
            flag = true;
            widthProperty = parseFloat(widthProperty) - 0.2 + "%";
            heightProperty = parseFloat(heightProperty) - 0.2 + "%";
        }
        if(flag){
            oPuzzleArea.css('min-width',widthProperty);
            oPuzzleArea.css('min-height',heightProperty);
        }
    };
    this.mouseClick = function(e){
        maxWidth = e.clientX;
        maxHeight = e.clientY;
        $("#"+dragElement).on('mousemove',dragMouse);
        $(document). on('mousemove',dragMouse);
        $('body').css('cursor','nwse-resize');
    };
}

function GameDraw(){
    this.stackedData = null;
    this.icons = {};
    }

GameDraw.prototype.changeViewFn =  function(oElement){
                                        var numberOfClick = $('#totalClicked');
                                        numberOfClick.text(parseInt(numberOfClick.text())+1);
                                        var elementData = oElement.attr('row-data');
                                        var keyName = gameController.keyName;
                                        if(!this.stackedData){
                                            this.stackedData = oElement;
                                        }else{
                                            var stackData = this.stackedData.attr('row-data');
                                            if( this.icons[stackData] !== this.icons[elementData]){
                                                setTimeout(turnToImage,400,this,oElement)
                                            }else{
                                                this.stackedData = null;
                                            }
                                        }
                                        if(oElement.hasClass(keyName.QUESTION_CLASS)){
                                            oElement.removeClass(keyName.QUESTION_CLASS);
                                            oElement.addClass(keyName.ANSWER_CLASS);
                                            oElement.text(this.icons[elementData]);
                                            $(oElement.parent()[0]).removeClass(keyName.CHANGE_VIEW);

                                        }else{
                                            oElement.removeClass(keyName.ANSWER_CLASS);
                                            oElement.addClass(keyName.QUESTION_CLASS);
                                        }
                                };

var gameController = (function(){

                    var gameDrawFn = function(row, col,gameEventHandler){

                                        var divElmentId, cloneElement, divElement, r, c, ul, li, spanClassName,alphabetcellNo, maxCellNo;
                                        divElmentId = 'divider-'+GameDraw.counter;
                                        cloneElement = $('#divElementToClone');
                                        divElement = $(cloneElement).find('div').clone();
                                        $(divElement).attr('id',divElmentId);
                                            for(r = 0 ; r < row ; r++) {
                                                ul = $(cloneElement).find('ul').clone();
                                                for (c = 0; c < col; c++) {
                                                    spanClassName = '' + r + c ;
                                                    li = $(cloneElement).find('li').clone();
                                                    li.find('span').attr('row-data',spanClassName);
                                                    $(li).appendTo(ul);
                                                    maxCellNo = gameEventHandler.totalCell - 1;
                                                    alphabetcellNo = parseInt(Math.random() *10 % maxCellNo);
                                                    gameEventHandler.icons[""+r+c] = gameEventHandler.numberOfPairCells.splice(alphabetcellNo,1).toString();
                                                    gameEventHandler.totalCell--;
                                                }
                                                $(ul).appendTo(divElement);
                                            }
                                        return {elementID : divElmentId,
                                                gameObject :divElement
                                        };
                                    };

                    var drawFn = function(puzzleArea){
							 $("#error_blk").text("");
									$('#'+puzzleArea).empty();
                                    var gameEventHandler, numberOfCells, divElmentId, aAlphabet, row,col;
                                    aAlphabet = ['A','B','C','D','E','F','G','H','I','J','K','L',
                                        'M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
                                    row = $('#val1').val();
                                    col = $('#val2').val();
                                    if((row * col) %2  || (row * col) > 52){
                                        $("#error_blk").text("Can not be Draw...");
                                        return;
                                    }
                                    GameDraw.counter = GameDraw.counter !== undefined ? GameDraw.counter+1 : 1;
                                    gameEventHandler = new GameDraw();
                                    gameEventHandler.totalCell = row*col;

                                    numberOfCells = aAlphabet.slice(0,gameEventHandler.totalCell/2);
                                    gameEventHandler.numberOfPairCells = numberOfCells.concat(numberOfCells);
                                   
                                    $('#totalClicked').text(0);
                                    divElmentId = gameDrawFn(row,col,gameEventHandler);
                                    $(divElmentId.gameObject).appendTo('#'+puzzleArea);
                                    $("#"+divElmentId.elementID).on('click', 'li.change-view', function(){
                                        gameEventHandler.changeViewFn($(this).children());
                                    });
                                    $('aside>div:last-child').show();
                                };

                    return { startupFN : function(dragElement,puzzleArea){
                                var mouseEventHndler = new MouseEvent(dragElement, puzzleArea);
                                $("#"+dragElement).on('mousedown', mouseEventHndler.mouseClick);
                                $("#clickBtn").on('mousedown', function(){drawFn(puzzleArea)} );
                                $(document).on('mouseup', function () {
                                    $("#"+dragElement).off('mousemove');
                                    $(document).off('mousemove');
                                    $('body').css('cursor', 'initial');
                                });
                            }
                     };
})();

gameController.startupFN("dragElement","puzzleArea");
gameController.keyName = {
    QUESTION_CLASS : 'question-class',
    ANSWER_CLASS   : 'answer-class',
    CHANGE_VIEW    : 'change-view'
};
