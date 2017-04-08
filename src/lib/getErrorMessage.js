const map = {
    202: '用户名已存在',
    210: '用户名或密码错误',
    211: '该用户名不存在',
    217: '无效的用户名',
    unkown: '未知错误，稍后重试',
}

export default function({code}){
    if (map[code]){
        return map[code];
    } else {
        return map.unknown;
    }
};