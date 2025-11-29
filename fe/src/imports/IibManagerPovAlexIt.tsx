import svgPaths from "./svg-9dj5gashfd";
import imgLoginView from "figma:asset/93288006511a8af18c33c3533211032def541c64.png";

function LoginView() {
  return (
    <div className="absolute left-[183.16px] rounded-[16px] shadow-[0px_10px_15px_-3px_rgba(0,0,0,0.1),0px_4px_6px_-4px_rgba(0,0,0,0.1)] size-[80px] top-[24px]" data-name="LoginView">
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded-[16px]">
        <div className="absolute bg-[rgba(255,255,255,0)] inset-0 rounded-[16px]" />
        <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded-[16px] size-full" src={imgLoginView} />
      </div>
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex h-[31.992px] items-start relative shrink-0 w-full" data-name="Heading 1">
      <p className="basis-0 font-['Arial:Bold',sans-serif] grow leading-[32px] min-h-px min-w-px not-italic relative shrink-0 text-[#1d293d] text-[24px] text-center tracking-[-0.6px]">MedStaff Portal</p>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex h-[19.987px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="basis-0 font-['Arial:Regular',sans-serif] grow leading-[20px] min-h-px min-w-px not-italic relative shrink-0 text-[#62748e] text-[14px] text-center">Hospital Staff Scheduling System</p>
    </div>
  );
}

function LoginView1() {
  return (
    <div className="absolute content-stretch flex flex-col gap-[7.995px] h-[59.974px] items-start left-[24px] top-[125.98px] w-[398.333px]" data-name="LoginView">
      <Heading />
      <Paragraph />
    </div>
  );
}

function CardHeader() {
  return (
    <div className="h-[217.943px] relative shrink-0 w-[446.328px]" data-name="CardHeader">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[217.943px] relative w-[446.328px]">
        <LoginView />
        <LoginView1 />
      </div>
    </div>
  );
}

function PrimitiveLabel() {
  return (
    <div className="content-stretch flex gap-[8px] h-[13.997px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Arial:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#314158] text-[14px] text-nowrap whitespace-pre">Staff ID</p>
    </div>
  );
}

function Input() {
  return (
    <div className="absolute bg-white h-[47.995px] left-0 rounded-[10px] top-0 w-[398.333px]" data-name="Input">
      <div className="box-border content-stretch flex h-[47.995px] items-center overflow-clip pl-[40px] pr-[12px] py-[4px] relative rounded-[inherit] w-[398.333px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-slate-500 whitespace-pre">Enter your staff ID</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.833px] border-slate-200 border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Icon() {
  return (
    <div className="absolute left-[11.99px] size-[20px] top-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p1beb9580} id="Vector" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p32ab0300} id="Vector_2" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[47.995px] relative shrink-0 w-full" data-name="Container">
      <Input />
      <Icon />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-col gap-[7.995px] h-[69.987px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel />
      <Container />
    </div>
  );
}

function PrimitiveLabel1() {
  return (
    <div className="content-stretch flex gap-[8px] h-[13.997px] items-center relative shrink-0 w-full" data-name="Primitive.label">
      <p className="font-['Arial:Regular',sans-serif] leading-[14px] not-italic relative shrink-0 text-[#314158] text-[14px] text-nowrap whitespace-pre">Password</p>
    </div>
  );
}

function Input1() {
  return (
    <div className="absolute bg-white h-[47.995px] left-0 rounded-[10px] top-0 w-[398.333px]" data-name="Input">
      <div className="box-border content-stretch flex h-[47.995px] items-center overflow-clip px-[40px] py-[4px] relative rounded-[inherit] w-[398.333px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-slate-500 whitespace-pre">Enter your password</p>
      </div>
      <div aria-hidden="true" className="absolute border-[0.833px] border-slate-200 border-solid inset-0 pointer-events-none rounded-[10px]" />
    </div>
  );
}

function Icon1() {
  return (
    <div className="absolute left-[11.99px] size-[20px] top-[14px]" data-name="Icon">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d={svgPaths.p2566d000} id="Vector" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1bf79e00} id="Vector_2" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Icon2() {
  return (
    <div className="h-[20px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[20.84%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 14">
            <path d={svgPaths.pcb0000} id="Vector" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 7 7">
            <path d={svgPaths.p2314a170} id="Vector" stroke="var(--stroke-0, #90A1B9)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div className="absolute content-stretch flex flex-col items-start left-[366.34px] size-[20px] top-[14px]" data-name="Button">
      <Icon2 />
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[47.995px] relative shrink-0 w-full" data-name="Container">
      <Input1 />
      <Icon1 />
      <Button />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-col gap-[7.995px] h-[69.987px] items-start relative shrink-0 w-full" data-name="Container">
      <PrimitiveLabel1 />
      <Container2 />
    </div>
  );
}

function Checkbox() {
  return <div className="absolute left-0 size-[15.99px] top-[1.99px]" data-name="Checkbox" />;
}

function Label() {
  return (
    <div className="h-[19.987px] relative shrink-0 w-[114.349px]" data-name="Label">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border h-[19.987px] relative w-[114.349px]">
        <Checkbox />
        <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[23.98px] not-italic text-[#45556c] text-[14px] text-nowrap top-[-2px] whitespace-pre">Remember me</p>
      </div>
    </div>
  );
}

function Button1() {
  return (
    <div className="h-[19.987px] relative shrink-0 w-[112.422px]" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex h-[19.987px] items-start relative w-[112.422px]">
        <p className="font-['Arial:Regular',sans-serif] leading-[20px] not-italic relative shrink-0 text-[#009689] text-[14px] text-center text-nowrap whitespace-pre">Forgot password?</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="content-stretch flex h-[19.987px] items-center justify-between relative shrink-0 w-full" data-name="Container">
      <Label />
      <Button1 />
    </div>
  );
}

function Button2() {
  return (
    <div className="bg-gradient-to-r from-[#00bba7] h-[47.995px] relative rounded-[10px] shadow-[0px_10px_15px_-3px_#96f7e4,0px_4px_6px_-4px_#96f7e4] shrink-0 to-[#0092b8] w-full" data-name="Button">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[20px] left-[199.17px] not-italic text-[14px] text-center text-nowrap text-white top-[12px] translate-x-[-50%] whitespace-pre">Sign In</p>
    </div>
  );
}

function LoginView2() {
  return (
    <div className="content-stretch flex flex-col gap-[15.99px] h-[255.924px] items-start relative shrink-0 w-full" data-name="LoginView">
      <Container1 />
      <Container3 />
      <Container4 />
      <Button2 />
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="h-[16.003px] relative shrink-0 w-full" data-name="Paragraph">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[198.93px] not-italic text-[#62748e] text-[12px] text-center text-nowrap top-[-1.83px] translate-x-[-50%] whitespace-pre">Demo Access - Use any credentials to login</p>
    </div>
  );
}

function Text() {
  return (
    <div className="absolute content-stretch flex h-[16.667px] items-start left-0 top-[-0.83px] w-[43.359px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#45556c] text-[12px] text-nowrap whitespace-pre">Staff ID:</p>
    </div>
  );
}

function Paragraph2() {
  return (
    <div className="h-[16.003px] relative shrink-0 w-full" data-name="Paragraph">
      <Text />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[43.36px] not-italic text-[#45556c] text-[12px] text-nowrap top-[-1.83px] whitespace-pre">Any ID (e.g., SC001, DR123)</p>
    </div>
  );
}

function Text1() {
  return (
    <div className="absolute content-stretch flex h-[16.667px] items-start left-0 top-[-0.83px] w-[53.945px]" data-name="Text">
      <p className="font-['Arial:Regular',sans-serif] leading-[16px] not-italic relative shrink-0 text-[#45556c] text-[12px] text-nowrap whitespace-pre">Password:</p>
    </div>
  );
}

function Paragraph3() {
  return (
    <div className="h-[16.003px] relative shrink-0 w-full" data-name="Paragraph">
      <Text1 />
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[53.95px] not-italic text-[#45556c] text-[12px] text-nowrap top-[-1.83px] whitespace-pre">Any password</p>
    </div>
  );
}

function Container5() {
  return (
    <div className="bg-slate-50 h-[59.987px] relative rounded-[12px] shrink-0 w-full" data-name="Container">
      <div className="size-full">
        <div className="box-border content-stretch flex flex-col gap-[3.997px] h-[59.987px] items-start pb-0 pt-[11.992px] px-[11.992px] relative w-full">
          <Paragraph2 />
          <Paragraph3 />
        </div>
      </div>
    </div>
  );
}

function LoginView3() {
  return (
    <div className="box-border content-stretch flex flex-col gap-[7.995px] h-[100.807px] items-start pb-0 pt-[16.823px] px-0 relative shrink-0 w-full" data-name="LoginView">
      <div aria-hidden="true" className="absolute border-[0.833px_0px_0px] border-slate-200 border-solid inset-0 pointer-events-none" />
      <Paragraph1 />
      <Container5 />
    </div>
  );
}

function CardContent() {
  return (
    <div className="h-[404.727px] relative shrink-0 w-[446.328px]" data-name="CardContent">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid box-border content-stretch flex flex-col gap-[23.997px] h-[404.727px] items-start px-[23.997px] py-0 relative w-[446.328px]">
        <LoginView2 />
        <LoginView3 />
      </div>
    </div>
  );
}

function Card() {
  return (
    <div className="absolute bg-white box-border content-stretch flex flex-col gap-[23.997px] h-[648.333px] items-start left-[325.59px] p-[0.833px] rounded-[16px] top-[68.32px] w-[447.995px]" data-name="Card">
      <div aria-hidden="true" className="absolute border-[0.833px] border-slate-200 border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)]" />
      <CardHeader />
      <CardContent />
    </div>
  );
}

function LoginView4() {
  return (
    <div className="absolute h-[784.987px] left-0 top-0 w-[1099.17px]" data-name="LoginView">
      <Card />
    </div>
  );
}

function Container6() {
  return <div className="absolute bg-[#00d5be] blur-3xl filter left-[80px] rounded-[2.7962e+07px] size-[287.995px] top-[80px]" data-name="Container" />;
}

function Container7() {
  return <div className="absolute bg-[#00d3f3] blur-3xl filter left-[635.17px] rounded-[2.7962e+07px] size-[383.997px] top-[321px]" data-name="Container" />;
}

function LoginView5() {
  return (
    <div className="absolute h-[785px] left-0 opacity-10 top-0 w-[1099.17px]" data-name="LoginView">
      <Container6 />
      <Container7 />
    </div>
  );
}

function LoginView6() {
  return (
    <div className="absolute h-[16.003px] left-0 top-[745px] w-[1099.17px]" data-name="LoginView">
      <p className="absolute font-['Arial:Regular',sans-serif] leading-[16px] left-[549.29px] not-italic text-[#62748e] text-[12px] text-center text-nowrap top-[-1.83px] translate-x-[-50%] whitespace-pre">© 2025 MedStaff Hospital System. All rights reserved.</p>
    </div>
  );
}

export default function IibManagerPovAlexIt() {
  return (
    <div className="bg-[#f8fafb] relative size-full" data-name="IIB (Manager POV Alex) IT">
      <LoginView4 />
      <LoginView5 />
      <LoginView6 />
    </div>
  );
}