export default async function isLogin(callback){
    await fetch('/api/authenticate')
        .then(res => res.json())
        .then(res => {
            if(res.success){
                callback(true);
            } else if (res.success !== true) {
                callback(false);
            }
        })
}