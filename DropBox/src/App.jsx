import {useState} from "react"
import {Dropbox} from "dropbox"
  

const dbx=new Dropbox({ 
  accessToken:"sl.u.AGw72_bSHHKwEeaN_YmGg1d3GVD8L5r2so-99ezTuBJSsvQCanQEbyyhSTIuTaLc7UATtoHrPrSfJxUoxw0BP11dPLK4uOkHHTjFrFMfykANSoMlfCo2DVHQXaZNNpvdLD93OAhEHZW0o29X_d0orNCcFqAgDeeVNsMvgJ6OZCAXbjEF0OpBwo0iCGPJv9evGwLsXEut6qWc7guxajdHt4V_Af-rRWfTJDFVHGhh6gma8m9PHTAdkabt933xA-rptoiIqstApiu2kuFuQrwXNIcuawGGFKrMA6xPEiYF8iP5l8Q06Ftl04c1n2VqkVtLmA14KPGIZGPeYBcUUd-xQeESzpdsHmu4MuzTMWmFln-PQ9qMr1BXPOyowKGOry3C4SsGJNOmEXbEuPY0JfC5kGF6NlQSkCQrbMG9WGAS3H5OSgnigE8qfQkUK4K-kXqy7gP4FAqoTTrRPyMDmfNDsfDqCsCLoO0gQCkhyHIIOG_26oo0LyNt7mdBSWM5VfKUcT33FHuda7zLQNscl6U_gnlhe1TMkB-MzQGsjTX5Jg7UMSeZByrkIIfmfxjqXhByhDJqGoyv3piXsJaJ4SeiiMRzy2iq0miWyVoFLUZtasOgRYSyp73tAmuCnl6zAGI90SjjQtkZlXco6MQ6Cmj8pc3YQ_2zzjcbCnOAT1CE_N7vSeHrVnWrz_saKA6xWFi0Vueca-2eSPQgK6ZkvmTRjbxiXCGpbbBVBbiki5zN-_bMG3-WYJlyuIuqVzLMipOvVG4tqD0NyJWMjQx5dvjTqm_VfG1NXkn9dy36gbmre0vW7g5drsscQRCyTHzjyrcyC45ZPBbWkat3diknUZZ4MK4WuFO_eurfq9-Wh7kaKmp7i2CaS7-UJgsnKVF-cVrJjHEeIeh6bRk-F_rTeGIyJAfe8YppIbaGC422_D4-NeUdtqPB14otRgtkW1YAbuX1ULQs-vSIuD-d3V1_ogHL9Ps-r5dkvm4z1yBL_K-RYo9XV-K-CjuBUWDrlLxg9mN2wo00KaHmsSPibBsa62CgNotJ1lO-xTfkzdtPrzQF9woQd4a20DKI3lRRh5lfEg_I5j2eTjU3DIpJHAEqcaxhzjVwl3kjogHiFX4Io9hKOqu1ZZEZ83qwnXot7h2yqJDRPsBQwIl3ZkBKwZneV4fg5sy3HB9UEmZA5hsbSynU1wkEIOgFmOQ_s-U_e8H33DP4-uNBCyZE1LcHFpvFbhnA5VjCuZX4Ks1rLaRgTWCvH8ITXlfWCsAEaDRGtqZBFztZIKdiLWCf8G9kRva8WTTrFZh8LH5Hf0lfxq3-viOz8Ifhmq75_m1VbLYvSGL_dBzWE1xFYid6RWrGO1HHEpYCDSd9914oiXFfMXdJlLGqBdp_NY9ZOYgQe7-ig3BWrHTMTavyqsRazbtbEArSLTqMN0HGLBzFNICn1Ce-dfH7r49PQA"
})
export default function App(){ 
  const[msg,setMsg]=useState("");
const[file,setfile]=useState(null);
  async function upload(){ 
    if(!file)return "file not found"
    try{ 
      await dbx.filesUpload({ 
        path:"/"+file.name,
        contents:file,
        mode:{ 
          ".tag":"overwrite"
        }
      });
      setMsg("file uploaded");
    }
    catch(e){ 
         console.log("Full error:", e);
  console.log("Error details:", e.error);

  setMsg(
    "Upload failed: " +
    JSON.stringify(e.error || e.message)
  );
    }
  }
  return(
    <div>
      <input type="file" onChange={e=> setfile(e.target.files[0])}/>
      <button onClick={upload}>Upload</button>

      <p>{msg}</p>
    </div>
  );
}