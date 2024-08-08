let BASE_URL = "http://localhost:8000"

const URLS = {
    //STAGING_CONVERSATION_URL : BASE_URL.concat("/mediatorai/stage/conversation/fileupload"),
    //STAGING_FILE_UPLOAD_URL : BASE_URL.concat("/mediatorai/stage/conversation/fileupload"), //append conversation_id to the end
    
    STAGING_CONVERSATION_URL : "/mediatorai/stage/conversation/",
    STAGING_FILE_UPLOAD_URL : "/mediatorai/stage/conversation/fileupload/", //append conversation_id to the end
    STAGING_CONVERSATION_LIST_MESSAGES_URL : '/mediatorai/stage/conversation/show/'   

}

export { BASE_URL, URLS }