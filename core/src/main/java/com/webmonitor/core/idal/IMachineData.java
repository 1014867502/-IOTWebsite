package com.webmonitor.core.idal;

import com.webmonitor.core.model.MachineInfoEntity;

/**机器表**/
public interface IMachineData {

    MachineInfoEntity getMachineBySerial(String machineSerial);
}
