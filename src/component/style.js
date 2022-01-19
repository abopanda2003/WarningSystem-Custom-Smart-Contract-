import styled from "styled-components";
import MainBG from "../assets/back.png";

export const MainPageWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: url(${MainBG});
  background-size: 100% 100%;
`;

export const InputWrapper = styled.div`
  height: 500px;
  background-color: #0a163d;
  border: 2px solid #0a163d;
  border-radius: 10px;
  box-shadow: inset 0 4px 30px #0a163d;
  opacity: 0.6;
`;

export const TimeDisplayWrapper = styled.div`
  width: 200px;
  height: 50px;
  background-color: #070e23;
  border: 2px solid #0a163d;
  border-radius: 10px;
  box-shadow: inset 0 4px 30px #070e23;
  margin-top:20px;
  opacity: 0.6;
  display: flex;
  justifyContent: center;
`;

export const InputTitleWrapper = styled.span`
  color: white;
  font-size: 16px;
  font-weight: 2px;
  margin-top:10px;
`;

export const SplitBar = styled.div`
  background-color: #01071a;
  width:100%;
  height: 3px;
  box-shadow: inset 0 4px 30px #070e23;
`;

export const InputTextField = styled.input`
  height: 30px;
  font-size: 14px;
  background-color: #01071a;
  border: 1px solid #09071a;
  box-shadow: inset 0 4px 30px #070e23;
  color: white;
`;

export const ItemRegButton = styled.button`
  width: 100px;
  height: 30px;
  font-size: 14px;
  background-color: #ce3064;
  border: 1px solid #ce3064;
  box-shadow: inset 0 4px 30px #ce3064;
  color: white;
`;

export const EndsInfo = styled.span`
  /* Style for "5H 25M 16S" */
  width: 400px;
  height: 100px;
  text-shadow: 0 0 10px rgba(144, 204, 84, 0.4);
  color: #90cc54;
  font-size: 36px;
  font-weight: 700;
  font-style: normal;
  letter-spacing: normal;
  line-height: normal;
  text-align: center;
  text-transform: uppercase;
  margin-top: 0px;
`;

export const BeginInfo = styled.span`
  /* Style for "5H 25M 16S" */
  width: 207px;
  height: 40px;
  text-shadow: 0 0 10px rgba(144, 204, 84, 0.4);
  color: #90cc54;
  font-size: 36px;
  font-weight: 700;
  font-style: normal;
  letter-spacing: normal;
  line-height: normal;
  text-align: center;
  text-transform: uppercase;
  margin-top: 0px;
`;

export const CheckButton = styled.button`
  width: 100px;
  height: 40px;
  font-size: 14px;
  background-color: #3692e7;
  border: 1px solid #3692e7;
  border-radius: 10px;
  box-shadow: inset 0 4px 30px #3692e7;
  color: white;
  margin-top: 30px;
`;

export const ConnectButton = styled.button`
  width: 150px;
  height: 40px;
  font-size: 14px;
  background-color: #48d0d2;
  border: 1px solid #48d0d2;
  border-radius: 10px;
  box-shadow: inset 0 4px 30px #48d0d2;
  color: white;
  margin-top: 30px;
`;
