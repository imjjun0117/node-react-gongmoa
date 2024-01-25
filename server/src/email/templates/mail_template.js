const dotenv = require('dotenv');
dotenv.config();

let authMail = `
    <div>
      <table width="750" cellpadding="0" cellspacing="0" style="border-spacing:0;border-collapse:collapse;margin:0 auto;background-color:#fff;border:5px solid #e7e7e7;box-sizing:border-box;font-family:맑은 고딕;letter-spacing:-1px;line-height:1.4em;">
        <!-- HEADER -->
        <thead>
          <tr>
            <th colspan="1" rowspan="2" style="width:65px;height:52px;line-height:0;"></th>
            <th colspan="1" rowspan="1" style="height:52px;padding:48px 0 20px 0;border-bottom:2px solid #666;text-align:left;">
              <a href="" target="_blank" style="display: block; font-size: 28px; color: #1f2937; text-decoration: none; line-height: 52px;" rel="noreferrer noopener">
                공모아
              </a>
            </th>
            <th colspan="1" rowspan="2" style="width:65px;height:52px;line-height:0;"></th>
          </tr>
          <tr>
            <td style="padding:40px 0;text-align:left;line-height:45px;color:#333;font-size:36px;">이메일 인증 번호가 <br> 발급되었습니다.</td>
          </tr>
        </thead>
        <!-- CONTENTS -->
        <tbody>
          <tr>
            <td rowspan="3" style="width:65px;"></td>
            <td style="padding:85px 0 30px;text-align:left;line-height:28px;color:#333;font-size:20px;">
              이메일 인증번호를 발급해드렸습니다. <br>
            </td>
            <td rowspan="3" style="width:65px;"></td>
          </tr>
          <tr>
            <td style="padding:38px 0;background-color:#f7f7f8;text-align:center;line-height:36px;font-size:30px;font-weight:bold;">
              %%%@@%%%
            </td>
          </tr>
          <tr>
            <td style="padding:30px 0 70px;">
              <table cellpadding="0" cellspacing="0" style="border-spacing:0;border-collapse:collapse;">
                <tbody>
                  <tr>
                    <td style="width:180px;height:60px;line-height:0;"></td>
                    <td style="width:250px;height:60px;">
                      <a href="${process.env.CLIENT_URI}/login" style="padding:20px 0 20px;display:block;line-height:60px;font-weight:bold;font-size:18px;background-color:#1d4ed8;text-decoration:none;color:#fff;text-align:center;border:0">
                        공모아 홈페이지 로그인
                      </a>
                    </td>
                    <td style="width:180px;height:60px;line-height:0;"></td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
        <!-- FOOTER -->
        <tfoot>
          <tr>
            <td colspan="3" style="padding:30px 65px;text-align:left;line-height:23px;color:#333;font-size:16px;">
              본 메일은 발신전용입니다. <br>
              공모아 회원가입, 개인정보 수정을 위한 본인인증 메일이며, <br>
              신청자가 이메일을 잘 못 기입하여 원하지 않는 메일을 받게 되셨을 경우 해당 메일을 <br>
              즉시 삭제해주시기 바랍니다.
            </td>
          </tr>
          <tr>
            <td colspan="3" style="padding:40px 65px;background-color:#e7e7e7;text-align:left;line-height:20px;color:#999;font-size:14px;">
              경기도 남양주시 별내동   Tel: 010-2647-0117 <br>
              COPYRIGHT © GONGMOA ALL RIGHTS RESERVED
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
`

let findPassword = `
  <div>
    <table width="750" cellpadding="0" cellspacing="0" style="border-spacing:0;border-collapse:collapse;margin:0 auto;background-color:#fff;border:5px solid #e7e7e7;box-sizing:border-box;font-family:맑은 고딕;letter-spacing:-1px;line-height:1.4em;">
      <!-- HEADER -->
      <thead>
        <tr>
          <th colspan="1" rowspan="2" style="width:65px;height:52px;line-height:0;"></th>
          <th colspan="1" rowspan="1" style="height:52px;padding:48px 0 20px 0;border-bottom:2px solid #666;text-align:left;">
            <a href="" target="_blank" style="display: block; font-size: 28px; color: #1f2937; text-decoration: none; line-height: 52px;" rel="noreferrer noopener">
              공모아
            </a>
          </th>
          <th colspan="1" rowspan="2" style="width:65px;height:52px;line-height:0;"></th>
        </tr>
        <tr>
          <td style="padding:40px 0;text-align:left;line-height:45px;color:#333;font-size:36px;">비밀번호 수정</td>
        </tr>
      </thead>
      <!-- CONTENTS -->
      <tbody>
        <tr>
          <td rowspan="3" style="width:65px;"></td>
          <td style="padding:40px 0 30px;text-align:left;line-height:28px;color:#333;font-size:20px;">
            아래 버튼을 통해 비밀번호를 수정해주시기 바랍니다. <br>
          </td>
          <td rowspan="3" style="width:65px;"></td>
        </tr>
        <tr>
          <td style="padding:10px 0 40px;">
            <table cellpadding="0" cellspacing="0" style="border-spacing:0;border-collapse:collapse;">
              <tbody>
                <tr>
                  <td style="width:180px;height:60px;line-height:0;"></td>
                  <td style="width:250px;height:60px;">
                    <a href="${process.env.CLIENT_URI}/users/updatePwd?email=%%email%%&token=%%token%%" style="padding:20px 0 20px;display:block;line-height:60px;font-weight:bold;font-size:18px;background-color:#1d4ed8;text-decoration:none;color:#fff;text-align:center;border:0">
                      비밀번호 수정하기
                    </a>
                  </td>
                  <td style="width:180px;height:60px;line-height:0;"></td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
      <!-- FOOTER -->
      <tfoot>
        <tr>
          <td colspan="3" style="padding:30px 65px;text-align:left;line-height:23px;color:#333;font-size:16px;">
            본 메일은 발신전용입니다. <br>
            신청자가 이메일을 잘 못 기입하여 원하지 않는 메일을 받게 되셨을 경우 해당 메일을 <br>
            즉시 삭제해주시기 바랍니다.
          </td>
        </tr>
        <tr>
          <td colspan="3" style="padding:40px 65px;background-color:#e7e7e7;text-align:left;line-height:20px;color:#999;font-size:14px;">
            경기도 남양주시 별내동   Tel: 010-2647-0117 <br>
            COPYRIGHT © GONGMOA ALL RIGHTS RESERVED
          </td>
        </tr>
      </tfoot>
    </table>
  </div>

`

let notifyHtml = `
<div>
  <table width="750" cellpadding="0" cellspacing="0" style="border-spacing:0;border-collapse:collapse;margin:0 auto;background-color:#fff;border:5px solid #e7e7e7;box-sizing:border-box;font-family:맑은 고딕;letter-spacing:-1px;line-height:1.4em;">
    <!-- HEADER -->
    <thead>
      <tr>
        <th colspan="1" rowspan="2" style="width:65px;height:52px;line-height:0;"></th>
        <th colspan="1" rowspan="1" style="height:52px;padding:48px 0 20px 0;border-bottom:2px solid #666;text-align:left;">
          <a href="" target="_blank" style="display: block; font-size: 28px; color: #1f2937; text-decoration: none; line-height: 52px;" rel="noreferrer noopener">
            공모아
          </a>
        </th>
        <th colspan="1" rowspan="2" style="width:65px;height:52px;line-height:0;"></th>
      </tr>
      <tr>
        <td style="padding:40px 0;text-align:left;line-height:45px;color:#333;font-size:36px;">오늘의 공모주 일정</td>
      </tr>
    </thead>
    <!-- CONTENTS -->
    <tbody>
      <tr>
        <td rowspan="3" style="width:65px;"></td>
        <td style="padding:40px 0 30px;text-align:left;line-height:28px;color:#333;font-size:20px;">
          회원님이 즐겨찾기 하신 공모주 일정입니다. <br>
          자세한 내용은  <a href="${process.env.CLIENT_URI}/login" style="text-decoration:none;color:#333;font-weight:bold;">공모아</a> 홈페이지에서 확인해주세요! <br>
        </td>
        <td rowspan="3" style="width:65px;"></td>
      </tr>
      <tr>
        <td style="padding:20px 0;background-color:#f7f7f8;line-height:36px;">
          <div>
            <div style="padding:3px 0 5px 35px;line-height:36px;font-size:20px;font-weight:bold;">청약 시작 (%%@@ST_SUB_CNT%%@@건) </div>
            %%@@ST_SUB_INFO%%@@
          </div>
          <div>
            <div style="padding:3px 0 5px 35px;line-height:36px;font-size:20px;font-weight:bold;">청약 마감 (%%@@END_SUB_CNT%%@@건) </div>
            %%@@END_SUB_INFO%%@@
          </div>
          <div>
            <div style="padding:3px 0 5px 35px;line-height:36px;font-size:20px;font-weight:bold;">수요예측 시작 (%%@@ST_FORECAST_CNT%%@@건) </div>
            %%@@ST_FORECAST_INFO%%@@
          </div>
          <div>
            <div style="padding:3px 0 5px 35px;line-height:36px;font-size:20px;font-weight:bold;">수요예측 마감 (%%@@END_FORECAST_CNT%%@@건) </div>
            %%@@END_FORECAST_INFO%%@@
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:30px 0 70px;">
          <table cellpadding="0" cellspacing="0" style="border-spacing:0;border-collapse:collapse;">
            <tbody>
              <tr>
                <td style="width:180px;height:60px;line-height:0;"></td>
                <td style="width:250px;height:60px;">
                  <a href="${process.env.CLIENT_URI}/login" style="padding:20px 0 20px;display:block;line-height:60px;font-weight:bold;font-size:18px;background-color:#1d4ed8;text-decoration:none;color:#fff;text-align:center;border:0">
                    공모아 홈페이지 로그인
                  </a>
                </td>
                <td style="width:180px;height:60px;line-height:0;"></td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
    <!-- FOOTER -->
    <tfoot>
      <tr>
        <td colspan="3" style="padding:30px 65px;text-align:left;line-height:23px;color:#333;font-size:16px;">
          본 메일은 발신전용입니다. <br>
          알림을 끄고 싶다면 <a href="${process.env.CLIENT_URI}" style="text-decoration:none;color:#333;font-weight:bold;">공모아 홈페이지</a> 로그인 후 <br>
          개인정보 수정에서 끌 수 있습니다.
        </td>
      </tr>
      <tr>
        <td colspan="3" style="padding:40px 65px;background-color:#e7e7e7;text-align:left;line-height:20px;color:#999;font-size:14px;">
          경기도 남양주시 별내동   Tel: 010-2647-0117 <br>
          COPYRIGHT © GONGMOA ALL RIGHTS RESERVED
        </td>
      </tr>
    </tfoot>
  </table>
</div>
`


module.exports = {authMail, findPassword, notifyHtml}