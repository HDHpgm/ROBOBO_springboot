// 미리 작성된 영역 - 수정하지 않으셔도 됩니다.
// 사용자가 내용을 올바르게 입력하였는지 확인합니다.
function isValidContents(contents) {
    if (contents == '') {
        alert('내용을 입력해주세요');
        return false;
    }
    if (contents.trim().length > 140) {
        alert('공백 포함 140자 이하로 입력해주세요');
        return false;
    }
    return true;
}

// 익명의 username을 만듭니다.
function genRandomName(length) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        let number = Math.random() * charactersLength;
        let index = Math.floor(number);
        result += characters.charAt(index);
    }
    return result;
}

// 수정 버튼을 눌렀을 때, 기존 작성 내용을 textarea 에 전달합니다.
// 숨길 버튼을 숨기고, 나타낼 버튼을 나타냅니다.
function editPost(id) {
    showEdits(id);
    let contents = $(`#${id}-contents`).text().trim();
    $(`#${id}-textarea`).val(contents);
}

function showEdits(id) {
    $(`#${id}-editarea`).show();
    $(`#${id}-submit`).show();
    $(`#${id}-delete`).show();

    $(`#${id}-contents`).hide();
    $(`#${id}-edit`).hide();
}

function hideEdits(id) {
    $(`#${id}-editarea`).hide();
    $(`#${id}-submit`).hide();
    $(`#${id}-delete`).hide();

    $(`#${id}-contents`).show();
    $(`#${id}-edit`).show();
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 여기서부터 코드를 작성해주시면 됩니다.

$(document).ready(function () {
    // HTML 문서를 로드할 때마다 실행합니다.
    getMessages();
})

// 메모를 불러와서 보여줍니다.
function getMessages() {
    // 1. 기존 메모 내용을 지웁니다.
    $('#cards-box').empty();
    // 2. 메모 목록을 불러와서 HTML로 붙입니다.
    $.ajax({
        type: 'GET',
        url: '/api/memos',
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                let memo = response[i];
                let id = memo.id;
                let username = memo.username;
                let contents = memo.contents;
                let modifiedAt = memo.modifiedAt;
                modifiedAt = modifiedAt.substring(0, 10) + " / " + modifiedAt.substring(11, 19);
                addHTML(id, username, contents, modifiedAt);
            }

        }
    })
}
function getLastMessages() {
    // 1. 기존 메모 내용을 지웁니다.
    $('#cards-box').empty();
    // 2. 메모 목록을 불러와서 HTML로 붙입니다.
    $.ajax({
        type: 'GET',
        url: '/api/lastmemo',
        success: function (response) {
                let memo = response;
                let id = memo.id;
                let username = memo.username;
                let contents = memo.contents;
                let modifiedAt = memo.modifiedAt;
                modifiedAt = modifiedAt.substring(0, 10) + " / " + modifiedAt.substring(11, 19);
                addHTML(id, username, contents, modifiedAt);
        }
    })
}

// 메모 하나를 HTML로 만들어서 body 태그 내 원하는 곳에 붙입니다.
function addHTML(id, username, contents, modifiedAt) {
    // 1. HTML 태그를 만듭니다.
    let temp_html = `<div class="card-timeline">
                                <!-- date/username 영역 -->
                                <div class="metadata">
                                    <div class="date">
                                        ${modifiedAt}
                                    </div>
                                    <div id="${id}-username" class="username">
                                        ${username}
                                    </div>
                                </div>
                                <!-- contents 조회/수정 영역-->
                                <div class="contents">
                                    <div id="${id}-contents" class="text">
                                        ${contents}
                                    </div>
                                    <div id="${id}-editarea" class="edit">
                                        <textarea id="${id}-textarea" class="te-edit" name="" id="" cols="30" rows="5"></textarea>
                                    </div>
                                </div>
                                <!-- 버튼 영역-->
                                <div class="footer">
                                    <img id="${id}-edit" onclick="editPost('${id}')" class="icon-start-edit" src="img/edit.png" alt="">
                                    <img id="${id}-delete" onclick="deleteOne('${id}')" class="icon-delete" src="img/delete.png" alt="">
                                    <img id="${id}-submit" onclick="submitEdit('${id}')" class="icon-end-edit" src="img/done.png" alt="">
                                </div>
                            </div>`;
    // 2. #cards-box 에 HTML을 붙인다.
    $('#cards-box').append(temp_html);
}

// 메모를 생성합니다.
function writePost() {
    // 1. 작성한 메모를 불러옵니다.
    let contents = $('#contents').val();
    // 2. 작성한 메모가 올바른지 isValidContents 함수를 통해 확인합니다.
    if (isValidContents(contents) == false) {
        return;
    }
    // 3. genRandomName 함수를 통해 익명의 username을 만듭니다.
    let username = genRandomName(10);
    // 4. 전달할 data JSON으로 만듭니다.
    let data = {'username': username, 'contents': contents};
    // 5. POST /api/memos 에 data를 전달합니다.
    $.ajax({
        type: "POST",
        url: "/api/memos",
        contentType: "application/json", // JSON 형식으로 전달함을 알리기
        data: JSON.stringify(data),
        success: function (response) {
            alert('메시지가 성공적으로 작성되었습니다.');
            window.location.reload();
        }
    });
}

// 메모를 수정합니다.
function submitEdit(id) {
    // 1. 작성 대상 메모의 username과 contents 를 확인합니다.
    let username = $(`#${id}-username`).text().trim();
    let contents = $(`#${id}-textarea`).val().trim();
    // 2. 작성한 메모가 올바른지 isValidContents 함수를 통해 확인합니다.
    if (isValidContents(contents) == false) {
        return;
    }
    // 3. 전달할 data JSON으로 만듭니다.
    let data = {'username': username, 'contents': contents};
    // 4. PUT /api/memos/{id} 에 data를 전달합니다.
    $.ajax({
        type: "PUT",
        url: `/api/memos/${id}`,
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function (response) {
            alert("변경 완료");
            window.location.reload();
        }
    })
}

// 메모를 삭제합니다.
function deleteOne(id) {
    // 1. DELETE /api/memos/{id} 에 요청해서 메모를 삭제합니다.
    $.ajax({
        type: "DELETE",
        url: `/api/memos/${id}`,
        success: function (response) {
            alert("삭제 완료");
            window.location.reload();
        }
    })
}