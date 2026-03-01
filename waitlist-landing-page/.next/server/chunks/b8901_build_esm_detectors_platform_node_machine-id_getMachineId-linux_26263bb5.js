;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="9f8a41e1-f84b-f657-8937-e93dd205f899")}catch(e){}}();
module.exports=[20558,e=>{"use strict";var i=e.i(22734),r=e.i(97789);async function a(){for(let e of["/etc/machine-id","/var/lib/dbus/machine-id"])try{return(await i.promises.readFile(e,{encoding:"utf8"})).trim()}catch(e){r.diag.debug(`error reading machine id: ${e}`)}}e.s(["getMachineId",()=>a])}];

//# debugId=9f8a41e1-f84b-f657-8937-e93dd205f899
//# sourceMappingURL=b8901_build_esm_detectors_platform_node_machine-id_getMachineId-linux_26263bb5.js.map